import { Firestore } from "@google-cloud/firestore";
import { Router } from "express";
import { getCatalogRouter } from "./catalog";
import { getStructureRouter } from "./structure";

export const getRouters = ({ firestore }: { firestore: Firestore }) => {
    const router = Router();

    router.get("/s", (req, res) => {
       return res.json({
         hi: "hi",
       });
    });

    router.use("/structure", getStructureRouter({ firestore }));
    router.use("/catalog", getCatalogRouter({ firestore }));

    return router;
};
