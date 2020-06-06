import { Firestore } from "@google-cloud/firestore";
import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import cors from "cors";
import express from "express";
import { getRouters } from "./routers";

export interface ExpresContext {
    log: (message: string) => void;
    PORT: number;
}

export async function startApplication(context: ExpresContext) {
    const { log } = context;
    log("application started");

    const app = express();
    const firestore = new Firestore();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(cors());

    app.use(timeout("10s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Serve static files
    app.get("/", (req, res) => {
      res.send("OK");
    });

    app.use("/api/v1", getRouters({ firestore }));

    return { app };
}
