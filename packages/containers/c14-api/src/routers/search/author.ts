import { Router, Request, Response} from "express";
import Joi from "joi";
import { Db } from "mongodb";

const RESULTS_PER_PAGE = 100;

export const getAuthorSearchRouter = ({ db }: { db: Db}) => {
    const router = Router();

    router.post("/", async (req: Request, res: Response) => {

        if (!req.body) {
            return res.status(400).json({
                status: 400,
                title: "Invalid Body Params",
                detail: "Invalid Body Params",
            });
        }

        let name = String(req.body.name || "");
        const nameChars = "\\w\\u00C0-\\u021B\\-\\`'’ιλḰṕḾŃḱóOů̅ουḿα\u2019";
        name = name.replace(new RegExp("[^" + nameChars + "\\.\\-\\s]"), "").replace(/\s+/g, " ").trim();

        let page: number = parseInt(req.body.page as string, 10);
        page = page && isFinite(page) ? page : 1;

        const validationRes = Joi.object()
            .keys({
                name: Joi.string().min(3).max(255).required(),
                page: Joi.number().integer().min(1).max(99999).required(),
            })
            .validate({
                name, page
            });

        if (validationRes.error) {
            return res.status(400).json({
                status: 400,
                title: "Incorrect author or page",
                detail: validationRes.error,
            });
        }

        const where = buildAuthorWhere(name);

        try {
            const authors: {
                full: string,
                count: number,
                structures: number[],
            }[] = await db.collection("authors")
                .find<any>(where, {
                    sort: {count: -1},
                })
                .map(({full, count, structures}: any) => ({full, count, structures}))
                .toArray();

            const authorsCollection = authors.map(({full, count}: any) => ({full, count}));
            const structuresIds = authors.reduce((acc, { structures }) => acc.concat(structures), []);
            const uniqStructureIds = [...new Set([...structuresIds])];

            const totalPages = Math.ceil(uniqStructureIds.length / RESULTS_PER_PAGE);
            const resultingPages = uniqStructureIds.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

            return res.json({
                meta: {
                    searchString: req.body.name,
                    authors: authorsCollection,
                    total: uniqStructureIds.length,
                    pages: totalPages,
                },
                data: {
                    structures: resultingPages,
                }
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
}

function buildAuthorWhere(name: string) {
    if (name.length === 1) {
        return {
            a: name.toUpperCase(),
        };
    }
    if (name.length === 2) {
        return {
            ab: name.toUpperCase(),
        };
    }
    if (name.length === 3) {
        return {
            abc: name.toUpperCase(),
        };
    }

    return {
        abc: name.slice(0, 3).toUpperCase(),
        full: new RegExp("^" + RegExpEscape(name), "i"),
    };
}

function RegExpEscape(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
