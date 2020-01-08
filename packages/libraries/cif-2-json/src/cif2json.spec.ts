import {
    normalizeCifString,
    parse,
} from "./index";

describe("index", () => {
    it("should define parse method", () => {
        expect(parse).toBeDefined();
    });

    it("should define normalizeCifString method", () => {
        expect(normalizeCifString).toBeDefined();
    });
});
