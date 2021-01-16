import { Router, Request, Response} from "express";
import Joi from "joi";
import { Db } from "mongodb";
import { formulaToString, parseFormula } from "./formula.helper";

const RESULTS_PER_PAGE = 100;

export const getFormulaSearchRouter = ({ db }: { db: Db}) => {
    const router = Router();

    router.post("/", async (req: Request, res: Response) => {

        if (!req.body) {
            return res.status(500).json({
                status: 500,
                title: "Invalid Body Params",
                detail: "Invalid Body Params",
            });
        }

        let page: number = parseInt(req.body.page as string, 10);
        page = page && isFinite(page) ? page : 1;

        const formula = req.body.formula || "";

        const formulaObj = parseFormula(formula, false);
        const whereSimilar = prepareWhereSimilar(formulaObj);
        const whereExact = prepareWhereExact(formulaObj);

        try {
            const [exactResults, similarResults] = await Promise.all([
                getFormulaCollection(whereExact, db),
                getFormulaCollection(whereSimilar, db),
            ]);
            const structures = [...exactResults.data, ...similarResults.data];
            return res.json({
                meta: {
                    pages: 0,
                    total: 0,
                    searchFormula: formulaToString(formulaObj),
                    exactMatchStructures: 0,
                    similarMatchStructures: 0,
                    similarFormulas: [],
                },
                data: {
                    structures
                },
            });
        } catch(e) {
            // tslint:disable-next-line
            console.error(e.stack);
            return res.status(500).json({
                errors: [String(e)],
                meta: {},
            });
        }
    });

    return router;
};

async function getFormulaCollection(where: any, db: Db): Promise<any> {
    const formulas = await db
        .collection("formulas")
        .find(where, {
            sort: {count: -1},
            limit: 3000,
    }).toArray();
    if (!formulas) {
        return { data: [] };
    }
    return {
        formulas,
        data: reduceToStructure(formulas),
    };
}

function reduceToStructure(records: any[]): number[] {
    if (records.length === 0) {
        return [];
    }
    return records.reduce((sum, current) => {
        for (const strId of current.structures) {
            if (sum.indexOf(strId) === -1) {
                sum.push(strId);
            }
        }
        return sum;
    }, []);
}

function prepareWhere(formulaObj: any) {
    const formulaCopy = Object.assign({}, formulaObj);
    Object.keys(formulaCopy).forEach((key) => {
        if (formulaCopy[key] === "*") {
            formulaCopy[key] = { $gt: 0 };
        }
    });

    return formulaCopy;
}

function prepareWhereSimilar(formulaObj: any) {
    const where = prepareWhere(formulaObj);
    return {
        ...where,
        elements: { $ne: Object.keys(formulaObj).length },
    };
}

function prepareWhereExact(formulaObj: any) {
    const where = prepareWhere(formulaObj);
    return {
        ...where,
        elements: Object.keys(formulaObj).length,
    };
}
