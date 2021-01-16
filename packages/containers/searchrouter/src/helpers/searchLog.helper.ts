import { Request } from "express";

import {
    Db,
} from "mongodb";

export enum SearchType {
    "structure" = "structure",
    "author" = "author",
    "name" = "name",
    "formula" = "formula",
    "unitCell" = "unitCell",
}
interface SearchLogModel {
    ip: string;
    uid: string;
    data: Date;
    searchType: SearchType;
    details: object;
    results: {
        pages: number,
        total: number,
    };
}
export async function saveSearchLog({ config, req, searchType, details, results }: {
    config: { db: Db },
    req: Request,
    searchType: SearchType,
    details: object,
    results: { pages: number, total: number },
}): Promise<any> {
    const { db } = config;
    const doc = {
        ip: getUserIP(req),
        uid: getUid(req),
        data: new Date(),
        searchType,
        details,
        results,
    };
    return db.collection("search-logs").insertOne(doc);
}
function getUserIP(req: Request): string {
  return ((req.headers["x-forwarded-for"] || "") as  any).split(",").pop() ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress;
}
function getUid(req: Request) {
    return req.headers["x-uid"] || "";
}
