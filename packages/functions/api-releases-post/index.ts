import { Firestore, Timestamp } from "@google-cloud/firestore";
import * as Joi from "@hapi/joi";
import { Request, Response } from "express";
import * as semver from "semver";

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
    version: Joi.string().pattern(/^(\d+\.)(\d+\.)(\d+)$/),
    resources: Joi.object({
        css: Joi.string().min(0).max(80),
        js: Joi.string().min(0).max(80),
    }).required(),
});

export async function handler(
  req: Request, res: Response,
) {
    const { id, name, path, version, resources } = req.body;
    const { error } = schema.validate({
        id, name, path, version, resources,
    });
    if (!!error) {
        return res.status(400).json({
            errors: [String(error)],
            meta: {},
            data: {},
        });
    }

    let newVersion = version;
    if (!version) {
        const querySnapshot = await firestore
            .collection("releases")
            .doc(id)
            .get();
        const data = querySnapshot.data();

        if (data && data.version) {
            const s = semver.parse(data.version);
            if (s) {
                newVersion = s.inc("patch").format();
            }
        }
    }
    newVersion = newVersion || "0.0.1";

    const toStore = {
      id,
      name,
      path,
      resources,
      version: newVersion,
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
