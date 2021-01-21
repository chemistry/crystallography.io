import Joi from "joi";
import { Request, Response, Router } from "express";
import { Db } from "mongodb";
import * as Sentry from "@sentry/node";

const authorsPageValidation = Joi.number().integer().min(1).max(99999);
const authorItemValidation = Joi.object().keys({
    authorName: Joi.string().min(2).required(),
    page: Joi.number().integer().min(1).max(999),
});

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

const STRUCTURES_PAGE_SIZE = 100;

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
                  details: validationRes.error,
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
            Sentry.captureException(e);
            return res.status(500).json({
                errors: [{
                    status: 500,
                    title: "Unknown Error",
                    detail: String(e)
                }],
                meta: {},
            });
        }
    });

    router.get("/:name", async (req: Request, res: Response) => {
        const authorName = req.params.name;
        const page = req.query.page ? Number(req.query.page) : 1;

        const validationRes = authorItemValidation.validate({
            authorName,
            page,
        });
        if (validationRes.error) {
            return res.status(400).json({
                errors: [{
                  code: 400,
                  message: "Incorrect page",
                  details: validationRes.error,
                }],
            });
        }

        try {
            const author = await db.collection("authors").findOne({
                abc: (authorName.split(" ")[0]).substring(0, 3).toUpperCase(),
                full: authorName,
            });

            if (!author) {
                return res.status(400).json({
                    errors: [{
                        status: 400,
                        title: "Author not found",
                        detail: "Incorrect author or page",
                    }],
                });
            }

            const authorStructuresCount = author.structures.length;
            const pageCount = Math.ceil(authorStructuresCount / STRUCTURES_PAGE_SIZE);
            const pageContent = author.structures.slice((page - 1) * STRUCTURES_PAGE_SIZE, page * STRUCTURES_PAGE_SIZE);

            return res.json({
                meta: {
                    total: authorStructuresCount,
                    pages: pageCount,
                    name: authorName,
                },
                data: {
                    results: pageContent
                }
            });

        } catch(e) {
            // tslint:disable-next-line
            console.error(e.stack);
            Sentry.captureException(e);
            return res.status(500).json({
                errors: [{
                    status: 500,
                    title: "Unknown Error",
                    detail: String(e)
                }],
                meta: {},
            });
        }
    });


    return router;
};
