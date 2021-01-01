import {
    startServer,
} from "./app";

describe("startServer", () => {
    it("should export verible definition", () => {
        expect(startServer).toBeDefined();
    });
});
