import * as express from "express";
import * as path from "path";

import { getApplication } from "@chemistry/application-cod-search";
import { getLayout } from "../layout";
import { getPlatformAPI } from "./platform-api";

import { renderToHTML } from "./renderer";

export interface AppContext {
  log: (message: string) => void;
  PORT: number;
}

export async function startApplication(context: AppContext) {
    const { log, PORT } = context;
    const app = express();
    // add UTF-8 symbols parser
    app.set("query parser", "simple");

    // Remove header
    app.disable("x-powered-by");

    app.use(express.static(path.join(__dirname, "/../static"), { index: false }));

    app.use((req, res) => {
        const { url } = req;

        const platformAPI = getPlatformAPI();
        // TODO match application by URL
        // Lazy load coresponding application
        // Decouple layout with Application
        const application = getApplication({ platformAPI });
        const layout = getLayout({ platformAPI, application });

        const html = renderToHTML({
            url,
            layout,
        });

        res
          .header("Content-Type", "text/html; charset=utf-8")
          .status(200)
          .end(html);
    });

    await new Promise((resolve) => {
      app.listen(PORT, "0.0.0.0", () => {
          resolve(app);
      });
    });

    log(`Application Started on port: ${PORT}`);
}
