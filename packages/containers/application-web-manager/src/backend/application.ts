import * as express from "express";
import { PlatformFactory } from "../interfaces";
import { ApplicationManager } from "./application.manager";

export interface ExpresContext {
    log: (message: string) => void;
    PORT: number;
    platformFactory: PlatformFactory;
    applicationManager: ApplicationManager;
}

export async function startApplication(context: ExpresContext) {
    const { applicationManager, platformFactory } = context;
    const app = express();

    // add UTF-8 symbols parser
    app.set("query parser", "simple");

    // Remove header
    app.disable("x-powered-by");

    // Main middleware
    app.use(async (req, res, next) => {
        try {
          const plugins = await applicationManager.getPlugins({ url: req.url });
          const platform = platformFactory();

          await platform.addPlugins(plugins);
          await platform.initialize();

          const { statusCode, content } = await platform.getContent();

          res
            .header("Content-Type", "text/html; charset=utf-8")
            .status(statusCode)
            .end(content);
          next();
        } catch (e) {
          next();
        }
    });

    return { app };
}
