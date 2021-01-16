import * as fs from "fs";
import * as path from "path";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { Express } from "express";
import { AppContextType, ApplicationContext, getApplication } from "../common";
import { startApplication } from "./application";
import { getLogger } from "./common/logger";

// tslint:disable-next-line
console.time("Context Prepare");

const htmlContent = fs.readFileSync(
  path.join(__dirname, "/../static/index.html"),
"utf8");

const appContext: ApplicationContext =  {
   type: AppContextType.backend,
};

const getPort = () => {
    const port = process.env.PORT;
    if (port && isFinite(parseInt(port, 10))  && parseInt(port, 10) > 0) {
        return parseInt(port, 10);
    }
    return 8080;
}

const initSentry = ({ app }: { app: Express })=> {
    Sentry.init({
        dsn: "https://359319ed89e449248751777db5d0921d@o187202.ingest.sentry.io/5595485",
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
    });
}

const getContext = async () => {
    const { mw, logger }  = await getLogger();
    const PORT = getPort();

    return {
        logger: {
            trace:(message: string) => {
                // tslint:disable-next-line
                console.log(message);
                logger.trace(message);
            },
            info: (message: string) => {
                // tslint:disable-next-line
                console.log(message);
                logger.info(message);
            },
            error: (message: string) => {
                // tslint:disable-next-line
                console.error(message);
                logger.error(message);
            }
        },
        PORT,
        onAppInit: (app: Express) => {
            initSentry({ app });
            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.tracingHandler());
            app.use(mw);
        },
        onAppInitEnd: (app: Express) => {
            app.use(Sentry.Handlers.errorHandler());
        },
        appFactory: getApplication,
        htmlContent,
        appContext,
    };
}

// tslint:disable-next-line
console.timeEnd("Context Prepare");

// tslint:disable-next-line
console.time("App Start");
(async () => {
    try {
        const context = await getContext();
        const { PORT, logger } = context;
        const { app } = await startApplication(context);

        await new Promise<void>((resolve) => {
            app.listen(PORT, "0.0.0.0", resolve);
        });

        logger.trace(`Application Started on port: ${PORT}`);
        // tslint:disable-next-line
        console.timeEnd("App Start");
    } catch (e) {
        Sentry.captureException(e);
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
