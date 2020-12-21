import { Db } from "mongodb";
import { Router } from "express";
import { getStructureRouter } from "./structure";
import { getCatalogRouter } from "./catalog";

export const getRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/structure", getStructureRouter({ db }));
    router.use("/catalog", getCatalogRouter({ db }))

    return router;
};
