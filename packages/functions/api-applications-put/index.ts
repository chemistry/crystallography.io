// import { Firestore } from "@google-cloud/firestore";
// import * as Joi from "@hapi/joi";
import { Request, Response } from "express";

// const firestore = new Firestore();

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
    const appId = req.params.appId || "";
    return res.status(200).json({
      errors: [],
      meta: {
        appId,
      },
      data: {},
    });
}
