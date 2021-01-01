import {
    Db,
    ObjectID,
} from "mongodb";
import {
    ChunkSearchModel,
    ChunkStatusModel,
    JobOutputModel,
    JobResponseModel,
    SearchStatusModel,
    SubstructureSearchModel,
} from "../models";
import {
    ChunksHelper,
} from "./chunks.helper";

const RESULTS_PER_PAGE  = 100;

export class QueueHelperController {

    public static async saveWorkerResponce({
        db, result, status,
    }: {
        db: Db,
        result: JobOutputModel,
        status: ChunkStatusModel,
    }): Promise<number> {
        // tslint:disable-next-line;
        const now = new Date();
        const rowId = ObjectID.createFromHexString(result.searchId);

        const collection = db.collection("substucture-searches");
        let incObj: any = {
            "queue.succeeded": 1,
        };
        if (status === ChunkStatusModel.failed) {
            incObj = {
                "queue.failed": 1,
              };
        }
        await collection.updateOne({
            _id: rowId,
        }, {
            $set: {
                updatedAt: new Date(),
                status: "processing",
                ["results." + result.index ]: result.results,
                ["resultsLength." + result.index ]: result.results.length,
            },
            $inc: {
                ...incObj,
                foundResults: result.results.length,
                version: 1,
            },
            $push: {
                processedIndexes: result.index,
            },
        });
        const record: SubstructureSearchModel = await collection.findOne({
            _id: rowId,
        }, { projection: { queue: 1, version: 1, isCanceled: 1 } });

        const processed = record.queue.failed + record.queue.succeeded;
        const total = record.queue.total;
        const isSearchFinished = (processed >= total);
        const isCanceled = record.isCanceled;
        if (isSearchFinished) {
            await collection.updateOne({
                _id: rowId,
            }, {
                $set: { status: "finished" },
            });
        } else {
            if (isCanceled) {
                await collection.updateOne({
                    _id: rowId,
                }, {
                    $set: { status: "canceled" },
                });
            }
        }
        return record.version;
    }

    public static async getSocketUpdate({
        db, searchId, fromVersion, page,
    }: {
        db: Db,
        searchId: string,
        fromVersion: number,
        page: number,
    }): Promise<JobResponseModel> {
      const collection = db.collection("substucture-searches");
      const rowId = ObjectID.createFromHexString(searchId);
      const record: SubstructureSearchModel = await collection.findOne({
          _id: rowId,
      }, { projection: { status: 1, queue: 1, foundResults: 1, resultsLength: 1, version: 1, processedIndexes: 1 } });

      const { foundResults, version, status, resultsLength, processedIndexes } = record;
      const { failed, succeeded, total } = record.queue;

      const progress = (total === 0) ? 100 : Math.round(((failed + succeeded)  / total) * 100);
      const pagesAvailable = ChunksHelper.getAvailablePagesCount(resultsLength, RESULTS_PER_PAGE);

      let results = null;
      const shouldUpdateResults = ChunksHelper.willHaveResultsUpdate({
          fromVersion,
          resultsLength,
          RESULTS_PER_PAGE,
          processedIndexes,
      });
      let min = -1;
      let max = -1;
      if (shouldUpdateResults) {
          const calcProjection = ChunksHelper.getProjectionsBasedOnLength(
              resultsLength,
              page,
              RESULTS_PER_PAGE,
          );
          [min, max] = calcProjection;
          let allResults: number[][] = [];
          if (min !== -1 && max !== -1) {
              const resSearchRecord: SubstructureSearchModel = await db.collection("substucture-searches").findOne({
                  _id: ObjectID.createFromHexString(searchId),
              }, {
                  projection: { results: { $slice: [ min, (max - min + 1) ] } },
              });
              if (min === 0) {
                  allResults = resSearchRecord.results;
              } else {
                  allResults = [
                      ...(new Array(min)).fill([]),
                      ...resSearchRecord.results,
                  ];
              }
              results = ChunksHelper.getPageRusults(resultsLength, allResults, page, RESULTS_PER_PAGE);
          }
      }

      const response: JobResponseModel = {
          meta: {
              id: searchId,
              status,
              progress,
              version,
              found: foundResults,
              page,
              pagesAvailable,
          },
          data: {
              results,
          },
      };
      return response;
    }

    public static async cancelSearchChunks({
        searchId,
        db,
        queue,
    }: { searchId: string, db: Db, queue: any }): Promise<void> {
        const collection = db.collection("substucture-searches");
        const rowId = ObjectID.createFromHexString(searchId);
        const record: SubstructureSearchModel = await collection.findOne({
            _id: rowId,
        }, { projection: { status: 1, queue: 1, version: 1, processedIndexes: 1 } });
        const { failed, succeeded, total } = record.queue;
        const { status, version, processedIndexes, isCanceled } = record;
        if (status === "finished" || isCanceled) {
            return;
        }
        const jobsToCancel: string[] = [];
        for (let i = 0; i < total; i++) {
            if (processedIndexes.indexOf(i) === -1) {
                jobsToCancel.push(searchId + ":" + i);
            }
        }
        if (jobsToCancel.length === 0) {
            return;
        }
        for (const jobId of jobsToCancel) {
            await removeJob({
                jobId, queue,
            });
        }
        await collection.updateOne({
            _id: rowId,
        }, {
            $set: { status: "canceled", isCanceled: true },
        });
    }
}

function removeJob({jobId, queue}: {jobId: string, queue: any}): Promise<void> {
    return new Promise((resolve, reject) => {
        queue.removeJob(jobId, (err: any) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
