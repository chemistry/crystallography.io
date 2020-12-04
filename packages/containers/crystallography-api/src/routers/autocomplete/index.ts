import { Firestore } from "@google-cloud/firestore";
import { Client } from "elasticsearch";
import { Router } from "express";

import { getNameAutocompleteRouter } from './name';

export const getAutocompletehRouters = ({ firestore, elasticSearch }: { firestore: Firestore, elasticSearch: Client }) => {
    const router = Router();

    router.use("/name", getNameAutocompleteRouter({ firestore,  elasticSearch }) );

    return router;
};

