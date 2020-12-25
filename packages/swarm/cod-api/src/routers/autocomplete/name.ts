import Joi from "joi";
import { Request, Response, Router } from "express";
import { Db } from "mongodb";
import { buildNameWhere, buildNameWhereAnd, buildNameWhereOr } from "./helper";

const RESULTS_PER_SUGGESTION = 100;

export const getNameAutocompleteRouter = ({ db }: { db: Db }) => {
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {
        let name = String(req.query.name || "");
        name = name
            .replace(/[^\-()'a-z/\\,.\][α-ωΑ-Ω0-9]/gim, " ")
            .replace(/\s+/g, " ")
            .trim();

        const validationRes = Joi.object()
            .keys({
                name: Joi.string().min(1).max(255).required(),
            })
            .validate({
                name,
            });

        if (validationRes.error) {
            return res.status(400).json({
                status: 400,
                title: "Incorrect name for autocomplete",
                detail: "Incorrect name for autocomplete",
            });
        }

        try {
            const isSingleWordSuggestion = name.split(" ").length === 1;

            if (isSingleWordSuggestion) {
                const where = buildNameWhere(name);

                const [namesCount, names] = await Promise.all([
                    getNamesCount(where, db),
                    getNameCollection(where, db),
                ]);
                return res.status(200).json({
                    meta: {
                        limit: 100,
                        items: namesCount,
                    },
                    data: names,
                });
            }

            const whereOR = buildNameWhereOr(name);
            const whereAnd = buildNameWhereAnd(name);

            const [
                andNamesCount,
                andNames,
                orNamesCount,
                orNames,
            ] = await Promise.all([
                getNamesCount(whereAnd, db),
                getNameCollection(whereAnd, db),
                getNamesCount(whereOR, db),
                getNameCollection(whereOR, db),
            ]);

            andNames.sort((name1, name2) => {
                return name1.name.length - name2.name.length;
            });

            const words = name.split(" ");
            orNames.sort((name1, name2) => {
                const occurrence =
                    numberOccurrence(words, name1.name) -
                    numberOccurrence(words, name2.name);
                if (occurrence !== 0) {
                    return occurrence;
                }
                return name1.name.length - name2.name.length;
            });

            const totalNamesCount = Math.min(andNamesCount + orNamesCount, 100);

            let namesCombined = [...andNames, ...orNames];
            namesCombined = uniqById(namesCombined);
            if (namesCombined.length > 100) {
                namesCombined.length = 100;
            }

            return res.json({
                meta: {
                    limit: 100,
                    items: totalNamesCount,
                },
                data: namesCombined,
            });
        } catch (e) {
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

const getNamesCount = async (where: any, db: Db): Promise<number> => {
    return ((await db
        .collection("names")
        .countDocuments(where)) as any) as Promise<number>;
};
const getNameCollection = async (where: any, db: Db) => {
    return await db
        .collection("names")
        .find(where)
        .sort({ count: -1 })
        .limit(RESULTS_PER_SUGGESTION)
        .map(({ _id, name, count }: any) => ({ _id, name, count }))
        .toArray();
};
const uniqById = (names: any[]) => {
    const res: any[] = [];
    const addedIds: any[] = [];
    names.forEach((name) => {
        const id = name._id.toString();
        if (addedIds.indexOf(id) === -1) {
            res.push(name);
            addedIds.push(id);
        }
    });
    return res;
};

const numberOccurrence = (words: string[], sentence: string) => {
    return words.reduce((res, curr) => {
        return sentence.indexOf(curr) !== -1 ? res + 1 : res;
    }, 0);
};
