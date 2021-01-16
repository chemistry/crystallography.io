import bodyParser from "body-parser";
import timeout from "connect-timeout";
import {
    Express,
} from "express";
import { Db } from "mongodb";
import {
    getSubstructureSearchCreator,
    postSubstructureSearchCreator,
} from "./api";
import { errorHandler, healthCheck, statusCheck } from "./helpers";

export async function initExpress(app: Express, queue: any, db: Db) {
    // Remove header
    app.disable("x-powered-by");

    // cors
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST");
        next();
    });

    // Connection time out
    app.use(timeout("30s"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/ping", (req, res) => {
        res.send("pong");
    });
    app.get("/api/v1/search/structure/hc", healthCheck({ db, queue }));
    app.get("/api/v1/search/structure/status", statusCheck({ db, queue }));

    // Include API router
    const substructrurePostController = await postSubstructureSearchCreator(queue, db);
    const substructrureGetController = getSubstructureSearchCreator(queue, db);

    app.post("/api/v1/search/structure", substructrurePostController);
    app.get("/api/v1/search/structure/:searchId", substructrureGetController);

    app.get("/", (req, res) => {
        res.send("index");
    });

    app.use(errorHandler);
}
