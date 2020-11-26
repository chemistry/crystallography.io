import { Firestore } from "@google-cloud/firestore";
import { Client } from 'elasticsearch';
import { Router } from "express";
import { getCatalogRouter } from "./catalog";
import { getStructureRouter } from "./structure";
import { getAuthorRouter } from "./authors";
import { getSearchRouters } from './search';


export const getRouters = ({ firestore, elasticSearch }: { firestore: Firestore, elasticSearch: Client }) => {
    const router = Router();

    router.get("/s", (req, res) => {
       return res.json({
         hi: "hi",
       });
    });

    router.use("/structure", getStructureRouter({ firestore }));
    router.use("/catalog", getCatalogRouter({ firestore }));
    router.use("/authors", getAuthorRouter({ firestore }));
    router.use("/search", getSearchRouters({ firestore, elasticSearch }));

    return router;
};
