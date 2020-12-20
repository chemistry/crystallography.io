import * as fs from "fs";
import { MongoClient } from "mongodb";
import * as path from "path";

const TOPIC = 'SCHEDULER_CATALOG';
export interface AppContext {
    logger: {
        info: (message: object) => Promise<void>;
        error: (message: object) => Promise<void>;
    },
    sendToQueue: (data: object) => void;
    version: string;
    close: () => void;
}

const getContext = async (): Promise<AppContext> => {
    const packagePath = path.resolve(__dirname, "../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());

    const connection = await require('amqplib').connect('amqp://rabbitmq');
    const chanel = await connection.createChannel();
    await chanel.assertQueue(TOPIC);

    const {
        MONGO_INITDB_ROOT_USERNAME,
        MONGO_INITDB_ROOT_PASSWORD,
        MONGO_INITDB_HOST
    }  = process.env;

    let connectionString = `mongodb://${MONGO_INITDB_HOST}`;
    if (MONGO_INITDB_ROOT_USERNAME && MONGO_INITDB_ROOT_PASSWORD) {
        connectionString  = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_INITDB_HOST}:27017`;
    }

    const mongoClient = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        reconnectTries: 60,
        reconnectInterval: 1000,
    });

    const db = mongoClient.db("crystallography");

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
        mongoClient.close();
        chanel.close();
    });

    const meta = {
        version: packageJSON.version,
        service: packageJSON.name,
        created: new Date(),
    };

    return {
        logger: {
            info: async (message: object) => {
                await db.collection('logs').insertOne({
                    severity: 'INFO',
                    ...meta,
                    message,
                });
            },
            error: async (message: object) => {
                await db.collection('logs').insertOne({
                    severity: 'ERROR',
                    ...meta,
                    message,
                });
            }
        },
        sendToQueue: (data: object): void => {
            chanel.sendToQueue(Buffer.from(JSON.stringify(data)));
        },
        close: () => {
           process.exit(0);
        },
        version: packageJSON.version,
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
        console.time('scheduler run');

        const eventName = process.argv.slice(2) || '';

        const { sendToQueue , logger, close } = await getContext();

        const message = {
            'trace-id': uuidv4(),
            'data': new Date(),
            'message': 'scheduler event'
        };
        sendToQueue(message);

        logger.info(message);

        // tslint:disable-next-line
        console.timeEnd('scheduler run');

        close();

    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
