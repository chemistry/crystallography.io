import * as Sentry from "@sentry/node";
import { startApplication } from "./app";
import { getLogger } from "./common/express-logger";
import { getMongoConnection } from "./common/mongo";
import { Express } from "express";
import { mongoCheck, healthCheck } from "./common/health-check";

const getPort = () => {
    const port = process.env.PORT;
    if (port && isFinite(parseInt(port, 10)) && parseInt(port, 10) > 0) {
        return parseInt(port, 10);
    }
    return 8080;
};

const initSentry = () => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || "",
        tracesSampleRate: 1.0,
    });
};

const getApplicationContext = async () => {
    const { db } = await getMongoConnection();
    const { logger, mw } = await getLogger();
    const PORT = getPort();

    return {
        logger: {
            trace: (message: string) => {
                console.log(message);
                logger.trace(message);
            },
            info: (message: string) => {
                console.log(message);
                logger.info(message);
            },
            error: (message: string) => {
                console.error(message);
                logger.error(message);
            }
        },
        onAppInit: (app: Express) => {
            initSentry();
            app.use("/", healthCheck([mongoCheck({ db })]));
            app.use(mw);
        },
        onAppInitEnd: (_app: Express) => {
            // Sentry error handler placeholder
        },
        PORT,
        db
    };
};

(async () => {
    try {
        console.time("App Start");

        const context = await getApplicationContext();
        const { PORT, logger } = context;

        const { app } = await startApplication(context);

        await new Promise<void>((resolve) => {
            app.listen(PORT, "0.0.0.0", resolve);
        });

        app.on("error", (err: any) => {
            console.error(err);
        });

        logger.trace(`Application Started on port: ${PORT}`);
        console.timeEnd("App Start");
    } catch (e) {
        Sentry.captureException(e);
        console.error(e);
        process.exit(-1);
    }
})();
