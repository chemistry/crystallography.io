import Joi from "joi";
import { Request, Response, Router } from "express";
import { Db } from "mongodb";

const authorsPageValidation = Joi.number().integer().min(1).max(99999);
const AUTHORS_PER_PAGE = 300;

const authorMapper = (showDetails: boolean) => {

    return (item: any)=> {
        const o = {
            id: item._id,
            type: "author",
            attributes: {
                full: item.full,
                count: item.count,
                updated: item.updated
            },
        } as any;
        if (showDetails  && Array.isArray(item.structures)) {
            o.attributes.structures = item.structures;
        }
        return o;
    }
}

export const getAuthorRouter = ({ db }: { db: Db}) => {
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {

        let page: number = parseInt(req.query.page as string, 10);
        page = page && isFinite(page) ? page : 1;

        const validationRes = authorsPageValidation.validate(page);
        if (validationRes.error) {
            return res.status(400).json({
                errors: [{
                  code: 400,
                  message: "Incorrect page",
                  details: "Incorrect page",
                }],
            });
        }
        try {
            const authorsCount = await db.collection("authors").countDocuments({});
            const totalPages = Math.ceil(authorsCount / AUTHORS_PER_PAGE);

            const authors = await db.collection("authors").find({
            }, {
                limit: AUTHORS_PER_PAGE,
                skip: ((page - 1) * AUTHORS_PER_PAGE),
                sort: { count: -1 },
            }).map(authorMapper(false)).toArray();

            return res.status(200).json({
                errors: [],
                meta: {
                    total: authorsCount,
                    pages: totalPages
                },
                data: (authors || []),
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
