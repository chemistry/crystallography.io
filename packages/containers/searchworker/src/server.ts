import * as Sentry from "@sentry/node";
const Queue = require("bee-queue");
import {
    Matcher,
    Molecule,
} from "@chemistry/molecule";
import {
    Db,
} from "mongodb";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import {
    JobInputModel,
    JobOutputModel,
} from "./models";

export async function startWorker() {
    try {
        const queue = new Queue("substructure-search", {
            redis: {
                host: process.env.REDIS_HOST || 'redis',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || ''
            },
            isWorker: true,
            removeOnSuccess: true,
            removeOnFailure: true,
        });

        const { db } = await getMongoConnection();
        const logger = await getLogger();

        queue.process((job: { data: JobInputModel }, done: (err: any, outData: JobOutputModel) => void) => {
            const searchId = job.data.searchId;
            const chunkId = job.data.index;

            processQ(db, job)
                .then((out: any) => {
                    done(null, out);
                })
                .catch((err: any) => {
                    Sentry.captureException(err);
                    logger.error(`"searchworker: job failed", ${JSON.stringify({ searchId, chunkId, err })}`);

                    done(err, {
                        index: chunkId,
                        searchId,
                        time: 0,
                        results: [],
                    });
                });
        });

        const closeConnections = () => {
            // tslint:disable-next-line
            console.log('closing connection');
            queue.close();
        };
        process.on('SIGINT', closeConnections);
        process.on('SIGTERM', closeConnections);

        logger.trace(`${new Date().toLocaleString()} searchworker:fork started with pid ${process.pid}`);

    } catch (e) {
        Sentry.captureException(e);
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
}

async function processQ(db: Db, job: { data: JobInputModel }): Promise<JobOutputModel> {
    const timeStart = process.hrtime();

    const searchId = job.data.searchId;
    const chunkId = job.data.index;
    const searchQuery =  job.data.searchQuery;
    const toCheck = job.data.toCheck;

    const molecule = new Molecule();
    molecule.load(searchQuery as any);
    const qStat = molecule.getAtomsStatistic();
    molecule.sortAtomsByCODStatistics();
    const moleculeMatcher = new Matcher(molecule);

    const fragments = db.collection("fragments");
    const cursor = fragments.find({
        _id: { $in: toCheck },
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
