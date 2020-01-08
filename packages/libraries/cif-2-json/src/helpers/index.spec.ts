import { loadMock } from "../mocks/mockHelper";
import { cif2json } from "./index";

describe("cif2json#parse", () => {
    const sut = cif2json;

    it("should export method", () => {
        expect(typeof sut).toEqual("function");
    });

    it("should return array", () => {
        expect(sut("")).toEqual({});
    });

    it("should correctly split cif files with several items", () => {
        const cifData = loadMock("001_several_data.cif");
        const parseResult = sut(cifData);

        expect(Object.keys(parseResult)).toEqual(["data_1000004", "data_1000005"]);
    });

    it("should process simple data lines", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(parseResult.data_1000004._chemical_formula_sum).toEqual("C29 H30 Cu I P2");
    });

    it("should process symbols conversion diring data line parse", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(parseResult.data_1000004._diffrn_radiation_type).toEqual("MoKα");
    });

    it('should set "?" as empty value', () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(parseResult.data_1000004._exptl_absorpt_correction_type).toEqual("");
    });

    it("should process multiline data values with delimer", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(parseResult.data_1000004._chemical_name_systematic).toEqual("awesome name");
    });

    it("should process multiline data values", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(parseResult.data_1000004._refine_ls_weighting_details)
            .toEqual("calc w=1/[σ^2^(Fo^2^)+(0.1038P)^2^+0.5590P] where P=(Fo^2^+2Fc^2^)/3");
    });

    it("should return loop_ as array", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(Array.isArray(parseResult.data_1000004.loop_)).toEqual(true);
    });

    it("should parse correctly loop_ keys as array", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        expect(Array.isArray(parseResult.data_1000004.loop_)).toEqual(true);

        const loops = parseResult.data_1000004.loop_;

        loops.forEach((loop: any) => {
            expect(Array.isArray(loop.columns)).toEqual(true);
            expect(Array.isArray(loop.data)).toEqual(true);

            expect(loop.columns.length).toBeGreaterThan(0);
        });
    });

    it("should return 4 loop_", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        const loops = parseResult.data_1000004.loop_;
        expect(loops.length).toEqual(4);
    });

    it("should return loop_[columns&data] as array", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        const loops = parseResult.data_1000004.loop_;

        loops.forEach((loop: any) => {
            expect(Array.isArray(loop.columns)).toEqual(true);
            expect(Array.isArray(loop.data)).toEqual(true);
        });
    });

    it("should return some values in loop_[columns]", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        const loops = parseResult.data_1000004.loop_;

        loops.forEach((loop: any) => {
            expect(loop.columns.length).toBeGreaterThan(0);
        });
    });

    it("should return some values in loop_[data]", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        const loops = parseResult.data_1000004.loop_;

        loops.forEach((loop: any) => {
            expect(loop.data.length).toBeGreaterThan(0);
        });
    });

    it("should return loop_[data] & loop_[columns] of equal length", () => {
        const cifData = loadMock("002_single_dataline.cif");
        const parseResult = sut(cifData);

        const loops = parseResult.data_1000004.loop_;
        loops.forEach((loop: any) => {
            // console.log(loop);
            const colsCount = loop.columns.length;
            expect(Array.isArray(loop.data)).toEqual(true);
            loop.data.forEach((line: any) => {
                expect(line.length).toEqual(colsCount);
            });
        });
    });

    it("should process correctly handle errors with data attribute", () => {
        const cifData = loadMock("2010108.cif");
        const parseResult = sut(cifData);
        expect(parseResult.data_2010108).toBeDefined();
    });

    it("should correctly process multiline comments", () => {
        const cifData = loadMock("2222708.cif");
        const parseResult = sut(cifData);
        expect(parseResult.data_2222708).toBeDefined();

        // '_chemical_name_systematic'
        const nameSystematic = parseResult.data_2222708._chemical_name_systematic;
        expect(nameSystematic).toEqual("Bromidobis(<i>N</i>,<i>N</i>-diphenylthiourea-κ<i>S</i>)copper(I)\nmonohydrate");
    });

    describe("performance test", () => {
        it("should process the file", () => {
            const cifData = loadMock("2222708.cif");
            /* tslint:disable */
            console.time("performance:");
            for (var i = 0; i < 30; i++) {
                const parseResult = sut(cifData);
            }
            console.timeEnd("performance:");
            /* tslint:enable */
            // reference 608-696 ms; droped to 190ms
            // n~30 -> 578ms; droped to 140ms
            // 130 ms

        });
    });

    it("should parse multiline loops", () => {
        const cifData = loadMock("1100937.cif");
        const parseResult = sut(cifData);
        expect(parseResult.data_1100937).toBeDefined();

        const authorLoop = parseResult.data_1100937.loop_.filter((item: any) => {
            return item.columns.indexOf("_publ_author_name") !== -1;
        });
        expect(authorLoop.length).toEqual(1);

        expect(authorLoop[0].data[0][0]).toEqual("Gerd Becker");

        const addr = ['Institut f\\"ur Anorganische Chemie',
            'Universit\\"at Stuttgart',
            "Pfaffenwaldring 55",
            "70569 Stuttgart",
            "Bundesrepublik Deutschland"].join("\n");

        expect(authorLoop[0].data[0][1]).toEqual(addr);
    });

    it("should not produce errors during loops parse", () => {
        const cifData = loadMock("1508375.cif");
        const parseResult = sut(cifData);
        expect(parseResult.data_1508375).toBeDefined();
    });

    it("should process loop errors", () => {
        const cifData = loadMock("1502740.cif");
        const parseResult = sut(cifData);
        expect(parseResult.data_1502740).toBeDefined();

        const coordLoop = parseResult.data_1502740.loop_.filter((item: any) => {
            return item.columns.indexOf("_atom_site_fract_x") !== -1;
        });
        expect(coordLoop.length).toEqual(1);
    });
});
