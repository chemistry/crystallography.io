import { Firestore } from "@google-cloud/firestore";
import { Router } from "express";

import { getAuthorSearchRouter } from './author';

export const getSearchRouters = ({ firestore }: { firestore: Firestore }) => {
    const router = Router();

    router.use("/author", getAuthorSearchRouter({ firestore }));

    return router;
};

