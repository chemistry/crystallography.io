import * as express from "express";
import { Platform, Plugin } from "../interfaces";

interface ApplicationManager {
    getPlugins({ url }: { url: string }): Promise<Plugin[]>;
}

export interface ExpressContext {
    log: (message: string) => void;
    PORT: number;
    platform: Platform;
    applicationManager: ApplicationManager;
}

export async function startApplication(context: ExpressContext) {
    const { log, PORT, applicationManager, platform } = context;
    const app = express();

    // add UTF-8 symbols parser
    app.set("query parser", "simple");

    // Remove header
    app.disable("x-powered-by");

    // Main middleware
    app.use(async (req, res) => {
      const plugins = await applicationManager.getPlugins({ url: req.url });
      await platform.addPlugins(plugins);
      await platform.initialize();

      const { statusCode, content } = await platform.getContent();

      res
        .header("Content-Type", "text/html; charset=utf-8")
        .status(statusCode)
        .end(content);
    });

    return { app };
}
