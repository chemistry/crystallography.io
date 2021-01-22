import { Db } from "mongodb";
import { Router } from "express";
import { getStructureRouter } from "./structure";
import { getCatalogRouter } from "./catalog";
import { getAuthorRouter } from "./authors";
import { getSearchRouters } from "./search";
import { getAutocompleteRouters } from "./autocomplete";
import { getSitemapRouters } from "./sitemap";
import { getCifDataRouter } from "./cif";

export const getRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.use("/api/v1/structure", getStructureRouter({ db }));
    router.use("/api/v1/catalog", getCatalogRouter({ db }));
    router.use("/api/v1/authors", getAuthorRouter({ db }));
    router.use("/api/v1/search", getSearchRouters({ db }));
    router.use("/api/v1/autocomplete", getAutocompleteRouters({ db }));
    router.use("/cif/",getCifDataRouter());
    router.use("/", getSitemapRouters({ db }));

    return router;
};
