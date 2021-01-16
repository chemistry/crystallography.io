import { Molecule } from "@chemistry/molecule";
import { NextFunction, Request, Response } from "express";
import {
    Db,
    ObjectID,
} from "mongodb";
import {
    saveSearchLog,
    SearchType,
} from "../helpers";
import {
    ChunkSearchModel,
    ChunkStatusModel,
    IFingerprintModel,
    JobInputModel,
    JobResponseModel,
    SearchStatusModel,
    SubstructureSearchModel,
} from "../models";

let fingerPrints: IFingerprintModel[] = [];
import { prepareChunksForSearch } from "./fingerprint.helper";

export async function postSubstructureSearchCreator(queue: any, db: Db) {
    // tslint:disable-next-line
    console.time('fingerprints loaded');
    fingerPrints = await db.collection("fingerprints").find({}).toArray();
    // tslint:disable-next-line
    console.timeEnd('fingerprints loaded');

    return (req: Request, res: Response, next: NextFunction) => {
        processSubstructureSearch({ req, res, next, queue, db });
    };
}

function processSubstructureSearch({
  req, res, next, queue, db,
}: { req: Request, res: Response, next: NextFunction, queue: any, db: Db }) {
    if (!req.body || !req.body.searchQuery) {
        return next({
            status: "message#1",
            title: "Wrong Search Query",
            detail: "Wrong Search Query Params",
        });
    }
    let jmol = {};
    const searchQuery = req.body.searchQuery;
    let searchQueryJSON = {};
    try {
        jmol = JSON.parse(searchQuery);
        searchQueryJSON = jmol;
        jmol = clearBondOrder(jmol);
    } catch (e) {
        return next({
            status: "message#2",
            title: "Wrong Search Query",
            detail: "Wrong Search Query Params",
        });
    }
    try {
        const molecule = new Molecule();
        molecule.load(jmol);
        const err = molecule.isSutableForSearch();
        if (err) {
            return next({
                status: "message#3",
                title: "Wrong Molecule",
                detail: "Wrong Molecule Params; " + err,
            });
        }
    } catch (e) {
        return next({
            status: "message#4",
            title: "Wrong Search Query Molecule",
            detail: "Wrong Search Query Molecule Params",
        });
    }

    scheduleSearch(jmol, queue, db)
      .then(({searchId, isFinished}) => {

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
          return next({
              status: "message#2",
              title: "DB error",
              detail: "Not able to save to database" + String(err),
          });
      });
}

function clearBondOrder(searchQuery: any): object {
    return {
        ...searchQuery,
        bonds: (searchQuery.bonds || []).map((bond: any) => {
            return [bond[0], bond[1], 1];
        }),
    };
}

async function scheduleSearch(
    searchQuery: object, queue: any, db: Db,
): Promise<{searchId: string, isFinished: boolean}> {

    const searchChunks = prepareChunksForSearch(searchQuery, fingerPrints);
    const searchId = await saveSearchRecord(db, searchQuery, searchChunks.length);
    const isFinished = (searchChunks.length === 0);
    if (!isFinished) {
        await scheduleChunksToSearch(searchId.toHexString(), searchChunks, searchQuery, queue);
    }

    return {
        searchId: searchId.toHexString(),
        isFinished,
    };
}

async function saveSearchRecord(db: Db, searchQuery: object, chunkLength: number): Promise<ObjectID> {
    const createdAt = new Date();
    const isFinished = (chunkLength === 0);
    const searchStatus: SubstructureSearchModel = {
        _id: new ObjectID(),
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
        results: (new Array(chunkLength)).fill(null),
        resultsLength: (new Array(chunkLength)).fill(null),
        processedIndexes: [],
    };

    const insertResponse = await db.collection("substructure-searches")
          .insertOne(searchStatus);
    const insertId = insertResponse.insertedId;
    return insertId;
}

async function scheduleChunksToSearch(
    searchId: string,
    chunks: number[][],
    searchQuery: object,
    queue: any,
): Promise<void> {

    for (let i = 0; i < chunks.length; i++) {
        const toCheck = chunks[i];

        const jobData: JobInputModel = {
            searchId,
            index: i,
            toCheck,
            searchQuery,
        };

        queue.createJob(jobData)
          .setId(searchId + ":" + i)
          .timeout(50000)
          .save();
    }
}
