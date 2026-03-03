import * as Sentry from "@sentry/node";
import { Worker } from "bullmq";
import {
    Matcher,
    Molecule,
} from "@chemistry/molecule";
import { Db } from "mongodb";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import {
    JobInputModel,
    JobOutputModel,
} from "./models";

const redisConnection = {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
};

export async function startWorker() {
    try {
        const { db } = await getMongoConnection();
        const logger = await getLogger();

        const worker = new Worker("substructure-search", async (job) => {
            const data = job.data as JobInputModel;
            const searchId = data.searchId;
            const chunkId = data.index;

            try {
                return await processQ(db, data);
            } catch (err: any) {
                Sentry.captureException(err);
                logger.error(`"searchworker: job failed", ${JSON.stringify({ searchId, chunkId, err: String(err) })}`);

                return {
                    index: chunkId,
                    searchId,
                    time: 0,
                    results: [],
                } as JobOutputModel;
            }
        }, {
            connection: redisConnection,
            removeOnComplete: { count: 0 },
            removeOnFail: { count: 0 },
        });

        const closeConnections = async () => {
            console.log('closing connection');
            await worker.close();
        };
        process.on('SIGINT', closeConnections);
        process.on('SIGTERM', closeConnections);

        logger.trace(`${new Date().toLocaleString()} searchworker:fork started with pid ${process.pid}`);

    } catch (e: any) {
        Sentry.captureException(e);
        console.error(e);
        process.exit(-1);
    }
}

async function processQ(db: Db, data: JobInputModel): Promise<JobOutputModel> {
    const timeStart = process.hrtime();

    const searchId = data.searchId;
    const chunkId = data.index;
    const searchQuery = data.searchQuery;
    const toCheck = data.toCheck;

    const molecule = new Molecule();
    molecule.load(searchQuery as any);
    const qStat = molecule.getAtomsStatistic();
    molecule.sortAtomsByCODStatistics();
    const moleculeMatcher = new Matcher(molecule);

    const fragments = db.collection("fragments");
    const cursor = fragments.find({
        _id: { $in: toCheck } as any,
    });
    const foundIds: number[] = [];

    nextfrag: while (await cursor.hasNext()) {
        const doc: any = await cursor.next();

        for (const fragment of doc.fragments) {
            if (!moleculeMatcher.canMatchByElements(fragment)) {
                continue;
            }

            const newFragment = Molecule.filterTargetBasedOnQuery(
                fragment, qStat,
            );

            if (!moleculeMatcher.canMatchByElements(newFragment)) {
                continue;
            }

            const mol = new Molecule();
            mol.load(newFragment);

            const matches = moleculeMatcher.getFirstMatch(mol);

            if (matches) {
                foundIds.push(doc._id);
                mol.destroy();
                continue nextfrag;
            }
            mol.destroy();
        }
    }

    const timeTotal = process.hrtime(timeStart)[1] / 1000000;

    return {
        index: chunkId,
        searchId,
        time: timeTotal,
        results: foundIds.sort((a, b) => a - b),
    };
}
