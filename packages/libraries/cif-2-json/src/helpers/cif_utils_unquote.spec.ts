import { unquoteLine } from "./cif_utils_unquote";

describe("cif2json#cif_utils_unquote", () => {
    const sut = unquoteLine;

    it("should define method", () => {
        expect(typeof sut).toEqual("function");
    });

    it("should return string", () => {
        expect(typeof sut("")).toEqual("string");
    });

    it("should unquote line form single quote", () => {
        expect(sut("'aaa'")).toEqual("aaa");
    });

    it("should unquote line form double quote", () => {
        expect(sut('"aaa"')).toEqual("aaa");
    });

    it("should take into account escapes", () => {
        expect(sut('"a\\\\' + '"aa"')).toEqual("a\\" + '"aa');
    });

    it("should igore single side escape ", () => {
        expect(sut('"a"aa')).toEqual('"a"aa');
    });

    it("should take into account double escapes ", () => {
        expect(sut('"a\\\\' + '"aa"')).toEqual("a\\" + '"aa');
    });
});
