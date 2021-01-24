import { Db } from "mongodb";
import Joi from "joi";
import { Router, Request, Response } from "express";
import { mapStructure } from '../../helpers';
import * as Sentry from "@sentry/node";

const structureIdValidation = Joi.number().integer().min(1000000).max(9999999);
const structureListValidation = Joi.array().items(structureIdValidation).min(1).max(200);

export const getStructureRouter = ({ db }: { db: Db}) => {
    const router = Router();

    // Structure details
    router.get("/:id", async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const structure =  await db.collection("structures").findOne({
                _id: Number(id),
            });

            res.json({
                meta: { },
                cache: {
                    type: "structure"
                },
                errors: [],
                data: structure,
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

    // Get structures list by Id's
    router.post("/", async (req: Request, res: Response) => {

        const { ids, expand } = req?.body || { ids: "[]", expand: false};
        const structureMapper = mapStructure(expand);

        let structuresIds: number[] = null;
        try {
            structuresIds = JSON.parse(ids);
        } catch (e) {
            // tslint:disable-next-line
            console.error(`error in parsing : ${ids},  ERROR: ${e}`)
            structuresIds = [];
        }

        try {
            const validationRes = structureListValidation.validate(structuresIds);
            if (validationRes.error) {
                return res.status(400).json({
                    errors: [{
                        status: 400,
                        title: "Incorrect structure ids",
                        details: validationRes.error,
                    }],
                });
            }

            const data = await db.collection("structures").find({
                _id: { $in : structuresIds },
            })
            .map(structureMapper)
            .toArray();

            return res.status(200).json({
                errors: [],
                meta: {},
                cache: {
                    type: "structure-details"
                },
                data,
            });

        } catch (e) {
            // tslint:disable-next-line
            console.error(String(e));
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
