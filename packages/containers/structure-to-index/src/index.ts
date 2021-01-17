import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import { app, AppContext } from "./app";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import { getChanel } from "./common/rabbitmq";

const QUEUE_NAME = 'STRUCTURE_CHANGED';

Sentry.init({
    dsn: "https://a60d6f90e4ad4b9ab1c380a326b886a1@o187202.ingest.sentry.io/5595573",
    tracesSampleRate: 1.0,
});
const getContext = async (): Promise<AppContext> => {

    const [ mongo, chanel, logger ] = await Promise.all([
        getMongoConnection(),
        getChanel(QUEUE_NAME),
        getLogger()
    ]);

    process.on('exit', (code) => {
        // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
    });

    return {
        logger,
        chanel,
        db: mongo.db,
        QUEUE_NAME,
    }
}

(async () => {
    try {
        // tslint:disable-next-line
        console.time('application start');

        const context = await getContext();
        await app(context);

        // tslint:disable-next-line
        console.timeEnd('application start');
    } catch(e) {
        Sentry.captureException(e);
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
