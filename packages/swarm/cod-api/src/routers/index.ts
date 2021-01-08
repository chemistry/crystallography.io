import { Db } from "mongodb";
import { Router } from "express";
import { getStructureRouter } from "./structure";
import { getCatalogRouter } from "./catalog";
import { getAuthorRouter } from "./authors";
import { getSearchRouters } from "./search";
import { getAutocompleteRouters } from "./autocomplete";
import { getSitemapRouters } from "./sitemap";

export const getRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/api/v1/structure", getStructureRouter({ db }));
    router.use("/api/v1/catalog", getCatalogRouter({ db }));
    router.use("/api/v1/authors", getAuthorRouter({ db }));
    router.use("/api/v1/search", getSearchRouters({ db }));
    router.use("/api/v1/autocomplete", getAutocompleteRouters({ db }));
    router.use("/", getSitemapRouters({ db }));

    return router;
};
