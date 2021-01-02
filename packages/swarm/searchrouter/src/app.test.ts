import {
    startServer,
} from "./app";

describe("startServer", () => {
    it("should export variable definition", () => {
        expect(startServer).toBeDefined();
    });
});
