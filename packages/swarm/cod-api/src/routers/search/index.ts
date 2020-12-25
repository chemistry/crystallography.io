import { Router } from "express";
import { Db } from "mongodb";
import { getNameSearchRouter } from './name';
import { getAuthorSearchRouter } from "./author";

export const getSearchRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/name", getNameSearchRouter({ db }) );
    router.use("/author", getAuthorSearchRouter({ db }));

    return router;
};

