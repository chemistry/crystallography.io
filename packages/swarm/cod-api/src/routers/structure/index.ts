import { Db } from "mongodb";
import Joi from "joi";
import { Router, Request, Response } from "express";

const structurePageValidation = Joi.number().integer().min(1).max(99999);
const structureIdValidation = Joi.number().integer().min(1000000).max(9999999);
const structureListValidation = Joi.array().items(structureIdValidation).min(1).max(100);

export const getStructureRouter = ({ db }: { db: Db}) => {
    const router = Router();

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

    return router;
};
