import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import express from "express";

export interface ExpresContext {
    log: (message: string) => void;
    PORT: number;
}

export async function startApplication(context: ExpresContext) {
    const { log } = context;
    log("application started");

    const app = express();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(timeout("5s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Serve static files
    app.get("/", (req, res) => {
      res.send("OK");
    });

    return { app };
}
