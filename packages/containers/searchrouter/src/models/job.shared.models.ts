import {
  SearchStatusModel,
} from "./substructure-search.model";

export interface JobOutputModel {
    searchId: string;
    index: number;
    results: number[];
    time: number;
}

export interface JobInputModel {
    searchId: string;
    index: number;
    toCheck: number[];
    searchQuery: object;
}

export interface JobResponseModel {
    meta: {
        id: string;
        status: SearchStatusModel,
        progress: number,
        version: number,
        found: number,
        page: number,
        pagesAvailable: number;
    };
    data: {
        results: number[],
    };
}
