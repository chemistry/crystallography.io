import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import cors from "cors";
import express from "express";

export interface ExpressContext {
    log: (message: string) => void;
    PORT: number;
}

export async function startApplication(context: ExpressContext) {
    const { log } = context;
    log("application started");

    const app = express();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(cors());

    app.use(timeout("10s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Serve static files
    app.get("/", (req, res) => {
      res.send("cod web: OK");
    });

    app.get("/api", (req, res) => {
        res.send("cod web: OK");
    });

    app.use((err: any, req: any, res: any, next: any) => {
        // tslint:disable-next-line
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    return { app };
}
