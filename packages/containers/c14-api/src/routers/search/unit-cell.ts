import { Router, Request, Response} from "express";
import Joi from "joi";
import { Db } from "mongodb";
import * as Sentry from "@sentry/node";


const RESULTS_PER_PAGE = 100;

export const getUnitCellSearchRouter = ({ db }: { db: Db}) => {
    const router = Router();

    router.post("/", async (req: Request, res: Response) => {

        if (!req.body) {
            return res.status(500).json({
                errors: [{
                    code: 500,
                    title: "Invalid Body Params",
                    detail: "Invalid Body Params",
                }],
            });
        }

        const tolerance = parseFloat(req.body.tolerance);
        let page: number = parseInt(req.body.page as string, 10);
        page = page && isFinite(page) ? page : 1;
        const { a, b, c, alpha, beta, gamma } =  req.body;

        const validationRes = Joi.object().keys({
            a: Joi.number().min(1).max(1000).required(),
            b: Joi.number().min(1).max(1000).required(),
            c: Joi.number().min(1).max(1000).required(),
            alpha: Joi.number().min(2).max(180).required(),
            beta: Joi.number().min(2).max(180).required(),
            gamma: Joi.number().min(2).max(180).required(),
            tolerance: Joi.number().min(0).max(100).required(),
            page: Joi.number().integer().min(1).max(99999).required(),
        }).validate({
            a, b, c, alpha, beta, gamma, tolerance, page,
        });

        if (validationRes.error) {
            return res.status(400).json({
                status: 400,
                title: "Invalid search params",
                detail: validationRes.error,
            });
        }

        const where = buildWhere({
            a, b, c, alpha, beta, gamma, tolerance
        });

        const documentsCount = await db.collection("structures").countDocuments(where);
        const structures = await db.collection("structures")
            .find(where, {
                limit: RESULTS_PER_PAGE,
                skip: ((page - 1) * RESULTS_PER_PAGE),
                sort: { "_id": 1 },
            })
            .map((doc)=> {
                return doc._id;
            }).toArray();

        const totalPages = Math.ceil(documentsCount / RESULTS_PER_PAGE);

        try {
            return res.json({
                meta: {
                    total: documentsCount,
                    pages: totalPages,
                },
                data: {
                    structures
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


function buildWhere(
    { a, b, c, alpha, beta, gamma, tolerance }:
    { a: number, b: number, c: number,
        alpha: number, beta: number, gamma: number, tolerance: number,
    },
  ) {
      return {
          __a: {
              $lte: ((+a) * (100 + (+tolerance)) / 100),
              $gte: ((+a) * (100 - (+tolerance)) / 100),
          },
          __b: {
              $lte: ((+b) * (100 + (+tolerance)) / 100),
              $gte: ((+b) * (100 - (+tolerance)) / 100),
          },
          __c: {
              $lte: ((+c) * (100 + (+tolerance)) / 100),
              $gte: ((+c) * (100 - (+tolerance)) / 100),
          },
          __alpha: {
              $lte: ((+alpha) * (100 + (+tolerance)) / 100),
              $gte: ((+alpha) * (100 - (+tolerance)) / 100),
          },
          __beta: {
              $lte: ((+beta) * (100 + (+tolerance)) / 100),
              $gte: ((+beta) * (100 - (+tolerance)) / 100),
          },
          __gamma: {
              $lte: ((+gamma) * (100 + (+tolerance)) / 100),
              $gte: ((+gamma) * (100 - (+tolerance)) / 100),
          },
      };
  }
