import pkg from '@chemistry/molecule';
const { Molecule } = pkg;
import * as Sentry from '@sentry/node';
import type { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import type { Db, Document } from 'mongodb';
import type { Queue } from 'bullmq';
import { saveSearchLog, SearchType } from '../helpers/index.js';
import { SearchStatusModel } from '../models/index.js';
import type {
  IFingerprintModel,
  JobInputModel,
  JobResponseModel,
  SubstructureSearchModel,
} from '../models/index.js';

let fingerPrints: IFingerprintModel[] = [];
import { prepareChunksForSearch } from './fingerprint.helper.js';

export async function postSubstructureSearchCreator(queue: Queue, db: Db) {
  console.time('fingerprints loaded');
  fingerPrints = (await db
    .collection('fingerprints')
    .find({})
    .toArray()) as unknown as IFingerprintModel[];
  console.timeEnd('fingerprints loaded');

  return (req: Request, res: Response, next: NextFunction) => {
    processSubstructureSearch({ req, res, next, queue, db });
  };
}

function processSubstructureSearch({
  req,
  res,
  next,
  queue,
  db,
}: {
  req: Request;
  res: Response;
  next: NextFunction;
  queue: Queue;
  db: Db;
}) {
  if (!req.body || !req.body.searchQuery) {
    return next({
      status: 'message#1',
      title: 'Wrong Search Query',
      detail: 'Wrong Search Query Params',
    });
  }
  let jmol: object;
  const searchQuery = req.body.searchQuery;
  let searchQueryJSON: object = {};
  try {
    const parsed = JSON.parse(searchQuery);
    searchQueryJSON = parsed;
    jmol = clearBondOrder(parsed);
  } catch (e: unknown) {
    Sentry.captureException(e);
    return next({
      status: 'message#2',
      title: 'Wrong Search Query',
      detail: 'Wrong Search Query Params',
    });
  }
  try {
    const molecule = new Molecule();
    molecule.load(jmol);
    const err = molecule.isSutableForSearch();
    if (err) {
      return next({
        status: 'message#3',
        title: 'Wrong Molecule',
        detail: 'Wrong Molecule Params; ' + err,
      });
    }
  } catch (e: unknown) {
    Sentry.captureException(e);
    return next({
      status: 'message#4',
      title: 'Wrong Search Query Molecule',
      detail: 'Wrong Search Query Molecule Params',
    });
  }

  scheduleSearch(jmol, queue, db)
    .then(({ searchId, isFinished }) => {
      saveSearchLog({
        config: { db },
        req,
        searchType: SearchType.structure,
        details: { searchId, searchQuery: searchQueryJSON },
        results: { pages: 0, total: 0 },
      });

      const response: JobResponseModel = {
        meta: {
          id: searchId,
          status: isFinished ? SearchStatusModel.finished : SearchStatusModel.created,
          progress: 0,
          version: 0,
          found: 0,
          page: 0,
          pagesAvailable: 0,
        },
        data: {
          results: [],
        },
      };
      res.json(response);
    })
    .catch((err) => {
      Sentry.captureException(err);
      return next({
        status: 'message#2',
        title: 'DB error',
        detail: 'Not able to save to database' + String(err),
      });
    });
}

function clearBondOrder(searchQuery: Record<string, unknown>): object {
  const bonds = (searchQuery.bonds || []) as number[][];
  return {
    ...searchQuery,
    bonds: bonds.map((bond: number[]) => {
      return [bond[0], bond[1], 1];
    }),
  };
}

async function scheduleSearch(
  searchQuery: object,
  queue: Queue,
  db: Db
): Promise<{ searchId: string; isFinished: boolean }> {
  const searchChunks = prepareChunksForSearch(searchQuery, fingerPrints);
  const searchId = await saveSearchRecord(db, searchQuery, searchChunks.length);
  const isFinished = searchChunks.length === 0;
  if (!isFinished) {
    await scheduleChunksToSearch(searchId.toHexString(), searchChunks, searchQuery, queue);
  }

  return {
    searchId: searchId.toHexString(),
    isFinished,
  };
}

async function saveSearchRecord(
  db: Db,
  searchQuery: object,
  chunkLength: number
): Promise<ObjectId> {
  const createdAt = new Date();
  const isFinished = chunkLength === 0;
  const searchStatus: SubstructureSearchModel = {
    _id: new ObjectId(),
    createdAt,
    updatedAt: createdAt,
    searchQuery,
    status: isFinished ? SearchStatusModel.finished : SearchStatusModel.created,
    isCanceled: false,
    queue: {
      total: chunkLength,
      succeeded: 0,
      failed: 0,
    },
    version: 0,
    foundResults: 0,
    results: new Array(chunkLength).fill(null),
    resultsLength: new Array(chunkLength).fill(null),
    processedIndexes: [],
  };

  const insertResponse = await db
    .collection('substructure-searches')
    .insertOne(searchStatus as unknown as Document);
  const insertId = insertResponse.insertedId;
  return insertId;
}

async function scheduleChunksToSearch(
  searchId: string,
  chunks: number[][],
  searchQuery: object,
  queue: Queue
): Promise<void> {
  for (let i = 0; i < chunks.length; i++) {
    const toCheck = chunks[i];

    const jobData: JobInputModel = {
      searchId,
      index: i,
      toCheck,
      searchQuery,
    };

    await queue.add('search', jobData, {
      jobId: searchId + ':' + i,
      attempts: 1,
    });
  }
}
