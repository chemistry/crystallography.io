import {
    normalizeCifString,
} from "./index";

describe("cif2json#normalizeCifString ", () => {
    const sut = normalizeCifString;
    it("shoudl should export method", () => {
        expect(typeof sut).toEqual("function");
    });

    it("should return string", () => {
        expect(typeof sut("")).toEqual("string");
    });

    it("should return original string if non cpecial characters", () => {
        expect(sut("abc")).toEqual("abc");
    });

    it("should replace special characters", () => {
        expect(sut("$-alpha")).toEqual("α");
    });

    it("should preform multiple special chars replacement", () => {
        expect(sut("$-alpha \\a")).toEqual("α α");
    });

    it("should preform normalization of codes", () => {
        expect(sut("&#x8721;")).toEqual("蜡");
    });

    it("should not left esc after transformation", () => {
        expect(sut("Gonz\\'alez Q., O.")).toEqual("González Q., O.");
    });
});
