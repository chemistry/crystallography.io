import * as express from "express";
import { ReleaseInfo } from "./app.releases";
import { STATIC_PATH } from "./constants";

export interface ExpresContext {
    log: (message: string) => void;
    PORT: number;
    releases: ReleaseInfo[];
}

export async function startApplication(context: ExpresContext) {
    const app = express();
    const { releases } = context;
    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    // Remove header
    app.disable("x-powered-by");

    app.use("/static", express.static(STATIC_PATH));

    app.get("/version", (req, res) => {
      res.json(releases);
    });

    app.get("/", (req, res) => {
      res.send("OK");
    });

    return { app };
}
