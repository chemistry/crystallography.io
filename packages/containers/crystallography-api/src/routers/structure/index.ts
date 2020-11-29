import { Firestore } from "@google-cloud/firestore";
import Joi from "joi";
import { Request, Response, Router } from "express";
import { mapStructure } from "../../helpers";

const structurePageValidation = Joi.number().integer().min(1).max(99999);
const structureIdValidation = Joi.number().integer().min(1000000).max(9999999);
const structureListValidation = Joi.array().items(structureIdValidation).min(1).max(100);

const PER_PAGE = 100;

export const getStructureRouter = ({ firestore }: { firestore: Firestore }) => {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {

    let page: number = parseInt(req.query.page as string, 10);
    page = page && isFinite(page) ? page : 1;

    const structureMaper = mapStructure();
    const validationRes = structurePageValidation.validate(page);
    if (validationRes.error) {
        return res.status(400).json({
            errors: [{
              code: 400,
              message: "Incorrect page",
              details: "Incorrect page",
            }],
        });
    }

    return firestore
      .collection("structures")
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE)
      .get()
      .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
          })
          .map(structureMaper);

          return res.status(200).json({
            errors: [],
            meta: {},
            data,
          });
      })
      .catch((e) => {
            // tslint:disable-next-line
            console.error(e.stack);
            return res.status(500).json({
                errors: [String(e)],
                meta: {},
         });
      });
  });

  // post - get structures by Id's
  router.post("/", (req: Request, res: Response) => {

    const { ids, expand } = req?.body || { ids: "[]", expand: false};
    const structureMaper = mapStructure(expand);

    let structuresIds: number[] = null;
    try {
        structuresIds = JSON.parse(ids);
    } catch (e) {
        structuresIds = [];
    }
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

    const refs = structuresIds.map((id) => firestore.doc(`structures/${id}`));

    return firestore
        .getAll(...refs)
        .then((docs) => {
            const data = docs
            .map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            })
            .map(structureMaper);

            return res.status(200).json({
                errors: [],
                meta: {},
                data,
            });
        })
        .catch((e) => {
            return res.status(500).json({
              errors: [String(e)],
              meta: {},
            });
        });

  });

  return router;
};
