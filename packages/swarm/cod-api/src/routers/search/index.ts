import { Router } from "express";
import { Db } from "mongodb";
import { getNameSearchRouter } from './name';
import { getAuthorSearchRouter } from "./author";
import { getFormulaSearchRouter } from "./formula";

export const getSearchRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/name", getNameSearchRouter({ db }) );
    router.use("/author", getAuthorSearchRouter({ db }));
    router.use("/formula", getFormulaSearchRouter({ db }));

    return router;
};

