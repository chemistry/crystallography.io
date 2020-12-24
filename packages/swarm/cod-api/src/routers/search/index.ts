import { Router } from "express";
import { Db } from "mongodb";
import { getNameSearchRouter } from './name';

export const getSearchRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/name", getNameSearchRouter({ db }) );

    return router;
};

