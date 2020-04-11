import * as express from "express";

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

    // Remove header
    app.disable("x-powered-by");

    app.get("/", (req, res) => {
      res.send("OK");
    });

    return { app };
}
