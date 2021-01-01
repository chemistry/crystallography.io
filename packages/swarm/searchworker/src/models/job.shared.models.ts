import {
  ObjectID,
} from "mongodb";

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
