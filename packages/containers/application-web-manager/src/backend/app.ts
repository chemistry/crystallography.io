import { AppPlatformAPI } from "@chemistry/application-common";
import * as express from "express";
import * as path from "path";
import { renderToHTML } from "./renderer";

export interface AppManager {
    getApplication: any;
    getLayout: any;
}

export interface AppContext {
    log: (message: string) => void;
    platformAPIFactory?: () => AppPlatformAPI;
    appManagerFactory?: (param: { url: string }) => AppManager;
    PORT: number;
}

export async function startApplication(context: AppContext) {
    const { log, PORT, platformAPIFactory, appManagerFactory } = context;

    const app = express();
    // add UTF-8 symbols parser
    app.set("query parser", "simple");

    // Remove header
    app.disable("x-powered-by");

    // app.use(express.static(path.join(__dirname, "/../static"), { index: false }));

    app.use((req, res) => {
        const { url } = req;

        const platformAPI = platformAPIFactory();
        const appManager = appManagerFactory({ url });

        const { getApplication, getLayout } = appManager;
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

    return Promise.resolve({ app });
}
