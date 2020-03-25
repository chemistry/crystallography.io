import { Firestore } from "@google-cloud/firestore";
import * as Joi from "@hapi/joi";
import { Request, Response } from "express";

const structurePageValidation = Joi.number().integer().min(1).max(10);
const firestore = new Firestore();

const PER_PAGE = 100;
export function mapResponce(item: any): any {
    return {
        id: item.id,
        type: "application",
        attributes: {
            ...item,
        },
    };
}

export async function handler(
  req: Request, res: Response,
) {
    const page = req.query.page || 1;
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
      .collection("releases")
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
          .map((item) => mapResponce(item));

          return res.status(200).json({
            errors: [],
            meta: {},
            data,
          });
      });
}
