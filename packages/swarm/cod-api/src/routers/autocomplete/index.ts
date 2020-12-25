import { Router } from "express";
import { Db } from "mongodb";
import { getAuthorAutocompleteRouter } from "./author";
import { getNameAutocompleteRouter } from "./name";


export const getAutocompleteRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/name", getNameAutocompleteRouter({ db }) );
    router.use("/author", getAuthorAutocompleteRouter({ db }));

    return router;
};
