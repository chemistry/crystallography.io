import { VERSION } from "./common";

describe("Common", () => {
    it("should export VERSION from file", () => {
        expect(VERSION).toBeDefined();
    });
});
