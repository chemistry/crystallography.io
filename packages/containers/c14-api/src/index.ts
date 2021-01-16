import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { startApplication } from "./app";
import { getLogger } from "./common/express-logger";
import { getMongoConnection } from "./common/mongo";
import { Express } from "express";

const getPort = ()=> {
    const port = process.env.PORT;
    if (port && isFinite(parseInt(port, 10))  && parseInt(port, 10) > 0) {
        return parseInt(port, 10);
    }
    return 8080;
}

const initSentry = ({ app }: { app: Express })=> {
    Sentry.init({
        dsn: "https://017ac8f85b4047af8fd3c3854025dda5@o187202.ingest.sentry.io/5595472",
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
    });
}

const getApplicationContext = async () => {
    const { db } = await getMongoConnection();
    const { logger, mw } = await getLogger();
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
                console.log(message);
                logger.error(message);
            }
        },
        onAppInit: (app: Express) => {
            initSentry({ app });
            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.tracingHandler());
            app.use(mw);
        },
        onAppInitEnd: (app: Express) => {
            app.use(Sentry.Handlers.errorHandler());
        },
        PORT,
        db
    }
}

(async () => {
    try {
        // tslint:disable-next-line
        console.time("App Start");

        const context = await getApplicationContext();
        const { PORT, logger } = context;

        const { app } = await startApplication(context);

        await new Promise<void>((resolve) => {
            app.listen(PORT, "0.0.0.0", resolve);
        });

        app.on("error", (err: any) => {
            // tslint:disable-next-line
            console.error(err);
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
