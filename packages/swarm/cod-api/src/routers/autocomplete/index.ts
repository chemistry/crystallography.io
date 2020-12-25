import { Router } from "express";
import { Db } from "mongodb";
import { getNameAutocompleteRouter } from "./name";


export const getAutocompleteRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/name", getNameAutocompleteRouter({ db }) );

    return router;
};
