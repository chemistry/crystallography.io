import Joi from "joi";
import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { Db } from "mongodb";

const RESULTS_PER_SUGGESTION = 100;

export const getAuthorAutocompleteRouter = ({ db }: { db: Db }) => {
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {
        let name = String(req.query.name || "");
        const nameChars = "\\w\\u00C0-\\u021B\\-\\`'’ιλḰṕḾŃḱóOů̅ουḿα\u2019";
        name = name.replace(new RegExp("[^" + nameChars + "\\.\\-\\s]"), "").replace(/\s+/g, " ").trim();

        const validationRes = Joi.object()
            .keys({
                name: Joi.string().min(1).max(255).required(),
            })
            .validate({
                name,
            });

        if (validationRes.error) {
            return res.status(400).json({
                errors: [{
                    code: 400,
                    title: "Incorrect name for autocomplete",
                    detail: validationRes.error,
                }],
            });
        }

        try {
            const where = buildAuthorWhere(name);

            const [authorsCount, authors] = await Promise.all([
                getAuthorsCount(where, db),
                getAuthorsCollection(where, db),
            ]);

            return res.json({
                meta: {
                    limit: 100,
                    items: authorsCount,
                },
                data: (authors || []),
            });
        } catch (e) {
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

function getAuthorsCount(where: any, db: Db): Promise<number> {
    return (db.collection("authors").countDocuments(where) as any) as Promise<number>;
}

function getAuthorsCollection(where: any, db: Db) {
    return db.collection("authors")
        .find(where, {
            sort: {count: -1},
            limit: RESULTS_PER_SUGGESTION,
        })
        .map(({full, count}: any) => ({full, count}))
        .toArray();
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
