import { MongoClient } from "mongodb";
import * as shell from "shelljs";
import { ExecOptions, ShellString } from "shelljs";
import { app, AppContext } from "./app";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import { getChanel } from "./common/rabbitmq";


const READ_QUEUE_NAME = 'COD_FILE_CHANGED';
const NOTICE_WRITE_QUEUE = 'STRUCTURE_CHANGED';

const getContext = async (): Promise<AppContext> => {

    const chanel = await getChanel(READ_QUEUE_NAME);
    const { db } = await getMongoConnection();
    const logger = await getLogger();

    process.on('exit', (code) => {
         // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
        logger.trace(`About to exit with code: ${code}`);
    });

    return {
        logger,
        getChanel: () => {
            return chanel;
        },
        exec: (command: string, options?: ExecOptions & { async?: false }): ShellString => {
            return shell.exec(command);
        },
        sendNoticeToQueue: (data: object): Promise<void> => {
            return chanel.sendToQueue(NOTICE_WRITE_QUEUE, Buffer.from(JSON.stringify(data)));
        },
        db,
        QUEUE_NAME: READ_QUEUE_NAME
    }
}

(async () => {
    try {
        const context = await getContext();

        // tslint:disable-next-line
        console.time('application start');
        await app(context);

        // tslint:disable-next-line
        console.timeEnd('application start');
    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
