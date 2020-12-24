import Joi from "joi";
import { Request, Response, Router } from "express";
import { Db } from "mongodb";

const catalogPageValidation = Joi.number().integer().min(1).max(99999);
const PER_PAGE = 100;


const catalogMapper = (item: any) => {
    return {
        id: item._id,
        type: "catalog",
        attributes: {
            id: item._id,
            structures: item.structures
        },
    };
};

export const getCatalogRouter = ({ db }: { db: Db}) => {
    const router = Router();

    router.get("/", async (req: Request, res: Response) => {

        let page: number = parseInt(req.query.page as string, 10);
        page = page && isFinite(page) ? page : 1;

        const validationRes = catalogPageValidation.validate(page);
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
            const pages = await db.collection("catalog").count({})
            const catalog = await db.collection("catalog")
                .find({})
                .sort({ 'id': 1 })
                .skip((page - 1) * PER_PAGE)
                .limit(PER_PAGE)
                .map(catalogMapper)
                .toArray();

            res.json({
                meta: {
                    pages
                },
                errors: [],
                data: catalog,
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
