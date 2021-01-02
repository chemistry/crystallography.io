const Queue = require("bee-queue");
import {
    Matcher,
    Molecule,
} from "@chemistry/molecule";
import {
    Db,
    MongoClient,
    ObjectID,
} from "mongodb";
import {
    blackIds,
} from "./blacklist";
import {
    JobInputModel,
    JobOutputModel,
    SearchStatisticsModel,
} from "./models";

export async function startWorker() {
    try {
        const queue = new Queue("substructure-search", {
            redis: {
                host: 'redis',
                port: 6379,
            },
            isWorker: true,
            removeOnSuccess: true,
            removeOnFailure: true,
        });

        const {
            MONGO_INITDB_ROOT_USERNAME,
            MONGO_INITDB_ROOT_PASSWORD,
            MONGO_INITDB_HOST
        }  = process.env;

        let connectionString = `mongodb://${MONGO_INITDB_HOST}`;
        if (MONGO_INITDB_ROOT_USERNAME && MONGO_INITDB_ROOT_PASSWORD) {
            connectionString  = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_INITDB_HOST}:27017`;
        }

        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true
        });

        const db = client.db("crystallography");
        queue.process((job: { data: JobInputModel }, done: (err: any, outData: JobOutputModel) => void) => {
            const searchId = job.data.searchId;
            const chunkId = job.data.index;

            processQ(db, job)
              .then((out: any) => {
                  done(null, out);
              })
              .catch((err: any) => {
                   // tslint:disable-next-line
                  console.error("searchworker: job failed", { searchId, chunkId }, err);

                  done(err, {
                      index: chunkId,
                      searchId,
                      time: 0,
                      results: [],
                  });
              });
        });

    } catch (err) {
         // tslint:disable-next-line
        console.error(err.toString());
         return;
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
