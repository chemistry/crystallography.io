import * as Sentry from "@sentry/node";
import * as fs from "fs";
import * as path from "path";
import { app, AppContext } from "./app";
import { getMongoConnection } from "./common/mongo";
import { getLogger } from "./common/logger";

Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    tracesSampleRate: 1.0,
});

const getContext = async (): Promise<AppContext> => {
    const packagePath = path.resolve(__dirname, "../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());

    const { db, close } = await getMongoConnection();
    const logger = await getLogger();

    process.on('exit', (code) => {
        console.log(`About to exit with code: ${code}`);
    });

    return {
        logger,
        close: () => {
            return close();
        },
        db,
    };
};

(async () => {
    try {
        const context = await getContext();

        console.time('application start');
        await app(context);

        console.timeEnd('application start');
    } catch (e) {
        Sentry.captureException(e);
        console.error(e);
        process.exit(-1);
    }
})();
