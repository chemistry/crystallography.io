import { FieldPath, Firestore } from "@google-cloud/firestore";
import Joi from "joi";
import { Request, Response, Router } from "express";

const catalogPageValidation = Joi.number().integer().min(1).max(99999);
const PER_PAGE = 100;

const catalogMaper = (item: any) => {

    return {
        id: item.id,
        type: "catalog",
        attributes: {
            ...item,
            id: item.id,
        },
    };
};

export const getCatalogRouter = ({ firestore }: { firestore: Firestore }) => {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {

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

    return firestore
      .collection("catalog")
      .orderBy("id")
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
          .map(catalogMaper);

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
