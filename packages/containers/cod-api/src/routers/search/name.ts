import { Router, Request, Response} from "express";
import Joi from "joi";
import { Db } from "mongodb";
import { mapStructure } from "../../helpers";


const RESULTS_PER_PAGE = 100;

const structureMapper = mapStructure(false);

export const getNameSearchRouter = ({ db }: { db: Db}) => {
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

        let name = req.body.name || "";
        name = name.replace(/[^\-()'a-z/\\,.\][α-ωΑ-Ω0-9]/gmi, " ").replace(/\s+/g, " ").trim();

        const pageNameValidation = Joi.object().keys({
            name: Joi.string().min(3).max(255).required(),
            page: Joi.number().integer().min(1).max(99999).required(),
        });

        const validationRes = pageNameValidation.validate({
            name, page,
        });

        if (validationRes.error) {
            return res.status(400).json({
                status: 400,
                title: "Incorrect author or page",
                detail: validationRes.error,
            });
        }

        const where = { $text: { $search: name }};

        try {

            const [structuresCount, structures ] = await Promise.all([
                db.collection("structures").countDocuments(where),
                db.collection("structures")
                    .find(where)
                    .project({ score: { $meta: "textScore" } })
                    .sort({ score: { $meta: "textScore" } })
                    .limit(RESULTS_PER_PAGE)
                    .skip((page - 1) * RESULTS_PER_PAGE)
                    .map(structureMapper).toArray(),
            ]);
            const totalPages = Math.ceil(structuresCount / RESULTS_PER_PAGE);

            return res.json({
                meta: {
                    total: structuresCount,
                    pages: totalPages,
                    searchString: req.body.name,
                },
                data: structures,
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
