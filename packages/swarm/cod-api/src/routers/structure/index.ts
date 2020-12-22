import { Db } from "mongodb";
import Joi from "joi";
import { Router, Request, Response } from "express";
import { mapStructure } from '../../helpers';

const structurePageValidation = Joi.number().integer().min(1).max(99999);
const structureIdValidation = Joi.number().integer().min(1000000).max(9999999);
const structureListValidation = Joi.array().items(structureIdValidation).min(1).max(100);


export const getStructureRouter = ({ db }: { db: Db}) => {
    const router = Router();

    // Structure details
    router.get("/:id", async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const structure =  await db.collection("structures").findOne({
                _id: String(id),
            });

            res.json({
                meta: { },
                errors: [],
                data: structure,
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

    // Get structures list by Id's
    router.post("/", async (req: Request, res: Response) => {

        const { ids, expand } = req?.body || { ids: "[]", expand: false};
        const structureMapper = mapStructure(expand);

        let structuresIds: number[] = null;
        try {
            structuresIds = JSON.parse(ids);
        } catch (e) {
            structuresIds = [];
        }

        try {

            const validationRes = structureListValidation.validate(structuresIds);
            if (validationRes.error) {
                return res.status(400).json({
                    errors: [{
                        status: 400,
                        title: "Incorrect structure ids",
                        detail: "Incorrect structure ids",
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
                data,
            });

        } catch (e) {
            return res.status(500).json({
                errors: [{
                    status: 500,
                    title: "Unknown error",
                    detail: String(e),
                }],
            });
        }


    });
    return router;
};
