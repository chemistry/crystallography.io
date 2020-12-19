import * as fs from "fs";
import * as path from "path";
import { Logging } from '@google-cloud/logging';

const TOPIC = 'SCHEDULER_CATALOG';
export interface AppContext {
    logger: {
        info: (message: string) => Promise<void>;
        error: (message: string) => Promise<void>;
    },
    sendToQueue: (data: object) => void;
    version: string;
}

const getContext = async (): Promise<AppContext> => {
    const packagePath = path.resolve(__dirname, "../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());

    const connection = await require('amqplib').connect('amqp://rabbitmq');
    const chanel = await connection.createChannel();
    await chanel.assertQueue(TOPIC);

    // Creates a client
    const logging = new Logging({
        projectId: 'crystallography-io',
        keyFilename: '/usr/credentials.json'
    });
      // Selects the log to write to
    const log = logging.log('scheduler');
    const metadata = {
        resource: { type: 'global' },
        severity: 'INFO',
    };

    process.on("uncaughtException", (err) => {
        // tslint:disable-next-line
        console.error('uncaughtException: ', err.message);
        // tslint:disable-next-line
        console.error(err.stack);
        process.exit(1);
    });

    process.on('exit', (code) => {
         // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
        chanel.close();
    });

    return {
        logger: {
            info: async (message: string) => {
                const entry = log.entry({
                    ...metadata,
                    severity: 'INFO'
                }, message);
                await log.write(entry);
            },
            error: async (message: string) => {
                const entry = log.entry({
                    ...metadata,
                    severity: 'ERROR'
                }, message);
                await log.write(entry);
            }
        },
        sendToQueue: (data: object): void => {
            // chanel.sendToQueue(Buffer.from(JSON.stringify(data)));
        },
        version: packageJSON.version
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // tslint:disable-next-line
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
    });
}

(async () => {
    try {
        // tslint:disable-next-line
        console.time('application start');

        const eventName = process.argv.slice(2) || '';

        const { sendToQueue , logger } = await getContext();

        const message = {
            'trace-id': uuidv4(),
            'time': new Date()
        };
        sendToQueue(message);

        logger.info(JSON.stringify(JSON.stringify({ source: 'scheduler', message })));

        // tslint:disable-next-line
        console.timeEnd('application start');
    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
