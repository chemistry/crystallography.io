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
            app.use(mw);
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
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
