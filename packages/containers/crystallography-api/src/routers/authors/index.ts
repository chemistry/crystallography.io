import { FieldPath, Firestore } from "@google-cloud/firestore";
import * as Joi from "@hapi/joi";
import { Request, Response, Router } from "express";

const authorsPageValidation = Joi.number().integer().min(1).max(99999);
const AUTHORS_PER_PAGE = 300;

const authorMaper = (showDetails: boolean) => {

    return (item: any)=> {
        const o = {
            id: item.id,
            type: "author",
            attributes: {
                full: item.full,
                count: item.count,
            },
        } as any;
        if (showDetails  && Array.isArray(item.structures)) {
            o.attributes.structures = item.structures;
        }
        return o;
    }
}

export const getAuthorRouter = ({ firestore }: { firestore: Firestore }) => {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {
    let page: number = parseInt(req.query.page as string, 10);
    page = page && isFinite(page) ? page : 1;

    const validationRes = authorsPageValidation.validate(page);
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
      .collection("authors")
      .limit(AUTHORS_PER_PAGE)
      .orderBy('count', "desc")
      .offset((page - 1) * AUTHORS_PER_PAGE)
      .get()
      .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
          })
          .map(authorMaper(false));

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
