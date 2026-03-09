import { ObjectId } from 'mongodb';
import type { Db, Document } from 'mongodb';
import type { Queue } from 'bullmq';
import { ChunkStatusModel } from '../models/index.js';
import type { JobOutputModel, JobResponseModel, SubstructureSearchModel } from '../models/index.js';
import { ChunksHelper } from './chunks.helper.js';

const RESULTS_PER_PAGE = 100;

export class QueueHelperController {
  public static async saveWorkerResponse({
    db,
    result,
    status,
  }: {
    db: Db;
    result: JobOutputModel;
    status: ChunkStatusModel;
  }): Promise<number> {
    const rowId = ObjectId.createFromHexString(result.searchId);

    const collection = db.collection('substructure-searches');
    let incObj: Record<string, number> = {
      'queue.succeeded': 1,
    };
    if (status === ChunkStatusModel.failed) {
      incObj = {
        'queue.failed': 1,
      };
    }
    await collection.updateOne(
      {
        _id: rowId,
      },
      {
        $set: {
          updatedAt: new Date(),
          status: 'processing',
          ['results.' + result.index]: result.results,
          ['resultsLength.' + result.index]: result.results.length,
        },
        $inc: {
          ...incObj,
          foundResults: result.results.length,
          version: 1,
        },
        $push: {
          processedIndexes: result.index,
        } as Document,
      }
    );
    const record = (await collection.findOne(
      {
        _id: rowId,
      },
      { projection: { queue: 1, version: 1, isCanceled: 1 } }
    )) as unknown as SubstructureSearchModel;

    const processed = record.queue.failed + record.queue.succeeded;
    const total = record.queue.total;
    const isSearchFinished = processed >= total;
    const isCanceled = record.isCanceled;
    if (isSearchFinished) {
      await collection.updateOne(
        {
          _id: rowId,
        },
        {
          $set: { status: 'finished' },
        }
      );
    } else {
      if (isCanceled) {
        await collection.updateOne(
          {
            _id: rowId,
          },
          {
            $set: { status: 'canceled' },
          }
        );
      }
    }
    return record.version;
  }

  public static async getSocketUpdate({
    db,
    searchId,
    fromVersion,
    page,
  }: {
    db: Db;
    searchId: string;
    fromVersion: number;
    page: number;
  }): Promise<JobResponseModel> {
    const collection = db.collection('substructure-searches');
    const rowId = ObjectId.createFromHexString(searchId);
    const record = (await collection.findOne(
      {
        _id: rowId,
      },
      {
        projection: {
          status: 1,
          queue: 1,
          foundResults: 1,
          resultsLength: 1,
          version: 1,
          processedIndexes: 1,
        },
      }
    )) as unknown as SubstructureSearchModel;

    const { foundResults, version, status, resultsLength, processedIndexes } = record;
    const { failed, succeeded, total } = record.queue;

    const progress = total === 0 ? 100 : Math.round(((failed + succeeded) / total) * 100);
    const pagesAvailable = ChunksHelper.getAvailablePagesCount(resultsLength, RESULTS_PER_PAGE);

    let results: number[] | null = null;
    const shouldUpdateResults = ChunksHelper.willHaveResultsUpdate({
      fromVersion,
      resultsLength,
      RESULTS_PER_PAGE,
      processedIndexes,
    });
    if (shouldUpdateResults) {
      const calcProjection = ChunksHelper.getProjectionsBasedOnLength(
        resultsLength,
        page,
        RESULTS_PER_PAGE
      );
      const [min, max] = calcProjection;
      if (min !== -1 && max !== -1) {
        const resSearchRecord = (await db.collection('substructure-searches').findOne(
          {
            _id: ObjectId.createFromHexString(searchId),
          },
          {
            projection: { results: { $slice: [min, max - min + 1] } },
          }
        )) as unknown as SubstructureSearchModel;
        let allResults: number[][];
        if (min === 0) {
          allResults = resSearchRecord.results;
        } else {
          allResults = [...new Array(min).fill([]), ...resSearchRecord.results];
        }
        results = ChunksHelper.getPageResults(resultsLength, allResults, page, RESULTS_PER_PAGE);
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
  }: {
    searchId: string;
    db: Db;
    queue: Queue;
  }): Promise<void> {
    const collection = db.collection('substructure-searches');
    const rowId = ObjectId.createFromHexString(searchId);
    const record = (await collection.findOne(
      {
        _id: rowId,
      },
      { projection: { status: 1, queue: 1, version: 1, processedIndexes: 1 } }
    )) as unknown as SubstructureSearchModel;
    const { total } = record.queue;
    const { status, processedIndexes, isCanceled } = record;
    if (status === 'finished' || isCanceled) {
      return;
    }
    const jobsToCancel: string[] = [];
    for (let i = 0; i < total; i++) {
      if (processedIndexes.indexOf(i) === -1) {
        jobsToCancel.push(searchId + ':' + i);
      }
    }
    if (jobsToCancel.length === 0) {
      return;
    }
    for (const jobId of jobsToCancel) {
      try {
        const job = await queue.getJob(jobId);
        if (job) {
          await job.remove();
        }
      } catch {
        // Job may already be completed or removed
      }
    }
    await collection.updateOne(
      {
        _id: rowId,
      },
      {
        $set: { status: 'canceled', isCanceled: true },
      }
    );
  }
}
