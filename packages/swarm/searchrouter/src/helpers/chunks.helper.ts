import {
    Db,
    ObjectID,
} from "mongodb";
import {
    ChunkSearchModel,
    ChunkStatusModel,
    JobOutputModel,
    SubstructureSearchModel,
} from "../models";

export class ChunksHelper  {

    public static getAvailablePagesCount(
        resultsLength: number[],
        RESULTS_PER_PAGE: number,
    ): number {
        let res = 0;
        for (const rowLength of resultsLength) {
            if (rowLength === null) {
              return Math.ceil(res / RESULTS_PER_PAGE);
            }
            res += rowLength;
        }
        return Math.ceil(res / RESULTS_PER_PAGE);
    }

    public static getPageResults(
        resultsLength: number[],
        results: number[][],
        page: number,
        RESULTS_PER_PAGE: number,
    ): number[] {
        const toSkip = RESULTS_PER_PAGE * ( page - 1);
        let combined: number[] = [];
        let offset = 0;
        let i = 0;
        for (const row of results) {
            const rowLength = resultsLength[i];
            if (rowLength === null || (combined.length + offset) > toSkip + RESULTS_PER_PAGE) {
                break;
            }
            if (offset + rowLength < toSkip) {
                offset += rowLength;
                continue;
            }
            combined = [...combined, ...row];
            i++;
        }
        if (combined.length + offset < toSkip) {
            return [];
        }
        return combined.slice(toSkip - offset, toSkip - offset + RESULTS_PER_PAGE);
    }

    public static getProjectionsBasedOnLength(
        resultsLength: number[],
        page: number,
        RESULTS_PER_PAGE: number,
    ): number[] {
        const minRange = RESULTS_PER_PAGE * ( page - 1);
        const maxRange = RESULTS_PER_PAGE * page;
        let min = 0;
        let max = 0;
        let maxCombined = 0;
        let combinedLength = 0;
        let hasBreak = false;
        let i = 0;
        for (const rowLength of resultsLength) {
            if (rowLength === null) {
                hasBreak = true;
                break;
            }
            if (combinedLength <= minRange) {
                min = i;
            }
            if (combinedLength < maxRange) {
                max = i;
                maxCombined = combinedLength + rowLength;
            }
            combinedLength += rowLength;

            i++;
        }

        if (hasBreak && maxCombined < maxRange) {
            return [-1, -1];
        }

        return [min, max];
    }

    public static willHaveResultsUpdate({
        fromVersion,
        resultsLength,
        RESULTS_PER_PAGE,
        processedIndexes,
    }: {
        fromVersion: number,
        resultsLength: number[],
        RESULTS_PER_PAGE: number
        processedIndexes: number[],
    }): boolean {
        return true;
    }
}
