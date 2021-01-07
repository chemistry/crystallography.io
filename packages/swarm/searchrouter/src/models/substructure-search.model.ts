import {
    ObjectID,
} from "mongodb";

export interface SubstructureSearchModel {
    _id: ObjectID;
    createdAt: Date;
    updatedAt: Date;
    searchQuery: object;
    status: SearchStatusModel;
    isCanceled: boolean;
    queue: {
        total: number;
        succeeded: number;
        failed: number;
    };
    foundResults: number;
    version: number;
    results: number[][];
    resultsLength: number[];
    processedIndexes: number[];
}

export interface ChunkSearchModel {
    _id: ObjectID;
    index: number;
    createdAt: Date;
    searchQuery: object;
    toCheck: number[];
    results: number[];
}

export enum ChunkStatusModel {
    finished = "finished",
    failed = "failed",
}

export enum SearchStatusModel {
    created = "created",
    canceled = "canceled",
    processing = "processing",
    finished = "finished",
}
