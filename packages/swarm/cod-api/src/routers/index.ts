import { Db } from "mongodb";
import { Router } from "express";
import { getStructureRouter } from "./structure";
import { getCatalogRouter } from "./catalog";
import { getAuthorRouter } from "./authors";
import { getSearchRouters } from "./search";
import { getAutocompleteRouters } from "./autocomplete";

export const getRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/structure", getStructureRouter({ db }));
    router.use("/catalog", getCatalogRouter({ db }));
    router.use("/authors", getAuthorRouter({ db }));
    router.use("/search", getSearchRouters({ db }));
    router.use("/autocomplete", getAutocompleteRouters({ db }))

    return router;
};
