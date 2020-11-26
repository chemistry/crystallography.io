import { Firestore } from "@google-cloud/firestore";
import { Client } from "elasticsearch";
import { Router } from "express";

import { getAuthorSearchRouter } from './author';
import { getNameSearchRouter } from './name';

export const getSearchRouters = ({ firestore, elasticSearch }: { firestore: Firestore, elasticSearch: Client }) => {
    const router = Router();

    router.use("/author", getAuthorSearchRouter({ firestore }));

    router.use("/name", getNameSearchRouter({ firestore,  elasticSearch }) );

    return router;
};

