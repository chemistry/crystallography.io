import { MongoClient } from "mongodb";
import { app, AppContext } from "./app";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import { getChanel } from "./common/rabbitmq";


const QUEUE_NAME = 'STRUCTURE_CHANGED';

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
        log: (text) => logger.log(text),
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
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
