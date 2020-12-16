import { Db } from "mongodb";
import { Router } from "express";
import { getStructureRouter } from "./structure";

export const getRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/structure", getStructureRouter({ db }));

    return router;
};
