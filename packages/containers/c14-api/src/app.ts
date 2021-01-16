import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import cors from "cors";
import express, { Express } from "express";
import { getRouters } from "./routers";
import { Db } from "mongodb";

export interface ApplicationContext {
    log: (message: string) => void;
    logger: any;
    onAppInit: (express: Express)=> void;
    PORT: number;
    db: Db;
}

export async function startApplication(context: ApplicationContext) {
    const { log, db, onAppInit } = context;
    log("application started");

    const app = express();
    onAppInit(app);

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(cors());

    app.use(timeout("10s"));

    app.use(bodyParser.urlencoded({ extended: true, limit: '1000kb' }));

    // Remove header
    app.disable("x-powered-by");


    // Serve static files
    app.get("/", (req, res) => {
      res.send("api/: OK");
    });

    app.get("/api", (req, res) => {
        res.send("api: OK");
    });

    app.use("/", getRouters({ db }));

    app.use((err: any, req: any, res: any, next: any) => {
        // tslint:disable-next-line
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    return { app };
}
