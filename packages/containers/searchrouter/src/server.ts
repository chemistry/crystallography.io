import { startServer } from "./app";
import * as Sentry from "@sentry/node";
import { getLogger } from "./common/express-logger";
import { getMongoConnection } from "./common/mongo";
import { healthCheck, mongoCheck } from "./common/health-check";

(async () => {
    try {
        await new Promise(res => setTimeout(res, 20000));
        const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

        const { db, close } = await getMongoConnection();
        const { logger, mw } = await getLogger();
        const hc = healthCheck([
            mongoCheck({ db })
        ]);

        const server = await startServer({ db, mw, hc });

        server.listen(PORT, () => {
            console.log(`${new Date().toLocaleString()} searchrouter - started on port ${PORT}`);
            logger.info(`${new Date().toLocaleString()} searchrouter - started on port ${PORT}`);
        });
        server.on("error", (err: any) => {
            console.error(err);
            logger.error(String(err));
        });

        process.on('SIGTERM', () => {
            console.log('closing connection');
        });

    } catch (e) {
        Sentry.captureException(e);
        console.error(e);
        process.exit(-1);
    }
})();

process.on("uncaughtException", (err) => {
    console.error('uncaughtException: ', err.message);
    console.error(err.stack);
});

process.on("SIGINT", () => {
    console.log(`Received SIGINT`);
});

process.on("SIGTERM", () => {
    console.log(`Received SIGTERM`);
});
