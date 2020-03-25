import { Firestore, Timestamp } from "@google-cloud/firestore";
import * as Joi from "@hapi/joi";
import { Request, Response } from "express";

const firestore = new Firestore();

export function mapResponce(item: any): any {
    return {
        id: item.id,
        type: "application",
        attributes: {
            ...item,
        },
    };
}

const schema = Joi.object({
    id: Joi.string().min(1).max(255).required(),
    name: Joi.string().min(1).max(255).required(),
    path: Joi.string().min(1).max(255).required(),
    version: Joi.string().pattern(/^(\d+\.)(\d+\.)(\d+)$/).required(),
});

export async function handler(
  req: Request, res: Response,
) {
    const { id, name, path, version } = req.body;
    const { error } = schema.validate({
        id, name, path, version,
    });
    if (!!error) {
        return res.status(400).json({
            errors: [String(error)],
            meta: {},
            data: {},
        });
    }

    const toStore = {
      id, name, path, version,
      date: Timestamp.now(),
    };

    return firestore
      .collection("releases")
      .doc(id)
      .set(toStore, { merge: true })
      .then(() => {
          return res.status(200).json({
              errors: [],
              meta: {},
              data: [mapResponce(toStore)],
          });
      });
}
