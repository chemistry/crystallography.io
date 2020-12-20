import * as fs from "fs";
import * as path from "path";
import { MongoClient } from "mongodb";
import { app, AppContext } from "./app";


const QUEUE_NAME = 'COD_FILE_UPDATED';

const getContext = async (): Promise<AppContext> => {
    const packagePath = path.resolve(__dirname, "../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());

    await new Promise(res => setTimeout(res, 20000));
    const connection = await require('amqplib').connect('amqp://rabbitmq');
    const chanel = await connection.createChannel();
    await chanel.assertQueue(QUEUE_NAME);
    await chanel.prefetch(1);

    const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME || '';
    const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || '';

    let connectionString = 'mongodb://mongo';
    if (MONGO_INITDB_ROOT_USERNAME && MONGO_INITDB_ROOT_PASSWORD) {
        connectionString  = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongo:27017`;
    }

    const mongoClient = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        reconnectTries: 60,
        reconnectInterval: 1000,
    });

    const db = mongoClient.db("crystallography");

    process.on('exit', (code) => {
         // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
        mongoClient.close();
        chanel.close();
    });

    const meta = {
        version: packageJSON.version,
        service: packageJSON.name,
    };

    let traceId = '';
    return {
        logger: {
            info: async (message: object) => {
                await db.collection('logs').insertOne({
                    severity: 'INFO',
                    traceId,
                    date: new Date(),
                    ...meta,
                    message,
                });
            },
            error: async (message: object) => {
                await db.collection('logs').insertOne({
                    severity: 'ERROR',
                    traceId,
                    date: new Date(),
                    ...meta,
                    message,
                });
            },
            setTraceId: (id: string)=> {
                traceId = id;
            }
        },
        getChanel: () => {
            return chanel;
        },
        db,
        QUEUE_NAME
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
