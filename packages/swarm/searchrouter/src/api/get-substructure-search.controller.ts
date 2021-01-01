import { NextFunction, Request, Response } from "express";
import {
    Db,
    ObjectID,
} from "mongodb";
import {
    ChunksHelper,
} from "../helpers";
import {
    JobResponseModel,
    SubstructureSearchModel,
} from "../models";

interface AppConfig {
    queue: any;
    db: Db;
}
const RESULTS_PER_PAGE  = 100;

export function getSubscructureSearchCreator(queue: any, db: Db) {
    const config: AppConfig = {
        queue,
        db,
    };
    return (req: Request, res: Response, next: NextFunction) => {
          Promise.resolve(
              processGetFn({ req, res, next, config }),
          )
          .catch(next);
    };
}

async function processGetFn({
    req, res, next, config,
}: {req: Request, res: Response, next: NextFunction, config: AppConfig }) {
    const { searchId } = req.params;
    const { queue, db } = config;
    const page = parseInt(req.query.page as any || 1, 10);

    if (!searchId || searchId.length < 18 || searchId.length > 32) {
        return next({
            status: 400,
            title: "Wrong SearchId",
            detail: "Wrong SearchID Params",
        });
    }
    if (!page || !isFinite(page)) {
        return next({
            status: 400,
            title: "Invalid page",
            detail: "Wrong page Params",
        });
    }
    const searchRecord: SubstructureSearchModel = await db.collection("substucture-searches").findOne({
        _id: ObjectID.createFromHexString(searchId),
    }, {
        projection: {
            resultsLength: 1,
            version: 1,
            status: 1,
            foundResults: 1,
            queue: 1,
        },
    });
    if (!searchRecord) {
        return next({
            status: 404,
            title: "Search Record Not Found",
            detail: "Search Record Not Found",
        });
    }
    const resultsLength = searchRecord.resultsLength;

    const calcProjection = ChunksHelper.getProjectionsBasedOnLength(
        resultsLength,
        page,
        RESULTS_PER_PAGE,
    );
    const [min, max] = calcProjection;
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
    }

    const version = searchRecord.version;
    const status = searchRecord.status;
    const found = searchRecord.foundResults;
    const { failed, succeeded, total } = searchRecord.queue;
    const progress = (total === 0) ? 100 : Math.round(( (failed + succeeded)  / total) * 100);
    const pagesAvailable = ChunksHelper.getAvailablePagesCount(resultsLength, RESULTS_PER_PAGE);
    const results = ChunksHelper.getPageRusults(resultsLength, allResults, page, RESULTS_PER_PAGE);

    const response: JobResponseModel = {
        meta: {
            id: searchId,
            status,
            progress,
            version,
            found,
            page,
            pagesAvailable,
        },
        data: {
            results,
        },
    };

    res.json(response);
}
