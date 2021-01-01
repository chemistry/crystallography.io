import {
    ChunksHelper,
} from "./chunks.helper";

describe("ChunksHelper", () => {
    it("should export verible definition", () => {
        expect(ChunksHelper).toBeDefined();
    });

    describe("getAvailablePagesCount", () => {
        it("should work for defined case", () => {
            const rowLength = [0, 0, 4, 0, 0, 0, 2, 2, 1, 0];
            const pages = ChunksHelper.getAvailablePagesCount(rowLength, 100);
            expect(pages).toEqual(1);
        });
    });

    describe("getPageRusults", () => {

        it("should return page array", () => {
            const rowLength = [3, 3, 3];
            const results = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
            const pageRes = ChunksHelper.getPageRusults(rowLength, results, 1, 2);
            expect(pageRes).toEqual([1, 2]);
        });
        it("should return empty array for unassign page", () => {
            const rowLength = [3, 3, 3];
            const results = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
            const pageRes = ChunksHelper.getPageRusults(rowLength, results, 10, 2);
            expect(pageRes).toEqual([]);
        });
        it("should take into account null", () => {
            const rowLength = [3, null,  3];
            const results = [[1, 2, 3], null, [7, 8, 9]];
            const pageRes = ChunksHelper.getPageRusults(rowLength, results, 2, 2);
            expect(pageRes).toEqual([3]);
        });
        it("should partially return data", () => {
            const rowLength = [3, 3,  3, 3];
            const results = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
            const pageRes = ChunksHelper.getPageRusults(rowLength, results, 5, 2);
            expect(pageRes).toEqual([9, 10]);
        });
        it("should take into account first empty page", () => {
            const rowLength = [null,  3];
            const results = [[1, 2, 3], [4, 5, 6]];
            const pageRes = ChunksHelper.getPageRusults(rowLength, results, 1 , 2);
            expect(pageRes).toEqual([]);
        });

        it("should work for defined case", () => {
            const rowLength = [0, 0, 4, 0, 0, 0, 2, 2, 1, 0];
            const results = [
                [], [], [ 4079037, 4079038, 4079041, 4080724 ],
                [], [], [], [ 7002425, 7009651 ],
                [ 7035237, 7035238 ],
                [ 7102456 ], [],
            ];
            const pages = ChunksHelper.getPageRusults(rowLength, results, 1, 100);
            expect(pages.length).toEqual(9);
        });

    });

    describe("getProjectionsBasedOnLength", () => {
        it("should calculate simple case for page #1", () => {
            const resLength = [10, 91, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 1, 100);
            expect(pageLen).toEqual([0, 1]);
        });
        it("should calculate correct right edge conditions", () => {
            const resLength = [10, 90, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 1, 100);
            expect(pageLen).toEqual([0, 1]);
        });
        it("should calculate left shift", () => {
            const resLength = [90, 90, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 1, 100);
            expect(pageLen).toEqual([0, 1]);
        });
        it("should calculate left shift edge condition", () => {
            const resLength = [100, 90, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 1, 100);
            expect(pageLen).toEqual([0, 0]);
        });

        it("should respect pagination", () => {
            const resLength = [99, 90, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 2, 100);
            expect(pageLen).toEqual([1, 2]);
        });

        it("should work with big arrays", () => {
            const resLength = [100, 100, 100, 100, 100];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 3, 100);
            expect(pageLen).toEqual([2, 2]);
        });

        it("should work with big inconsistent arrays", () => {
            const resLength = [98, 1, 5, 98, 2];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 2, 100);
            expect(pageLen).toEqual([2, 3]);
        });

        it("should respect inprocessed chunks", () => {
            const resLength = [98, null, 100, 100];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 2, 100);
            expect(pageLen).toEqual([-1, -1]);
        });

        it("should correctly process terminal data", () => {
            const resLength = [100, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 2, 100);
            expect(pageLen).toEqual([1, 1]);
        });

        it("should correctly treat unknown starting null ", () => {
            const resLength = [null, 10];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 2, 100);
            expect(pageLen).toEqual([-1, -1]);
        });
        it("should correctly work with starting null for first page", () => {
            const resLength = [null, 1000];
            const pageLen = ChunksHelper.getProjectionsBasedOnLength(resLength, 1, 100);
            expect(pageLen).toEqual([-1, -1]);
        });
    });
});
