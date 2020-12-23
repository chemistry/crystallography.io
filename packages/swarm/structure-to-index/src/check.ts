import { MongoClient } from 'mongodb';
import { processMessage } from './process';

// tslint:disable-next-line
(async ()=> {
    // tslint:disable-next-line

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
        useUnifiedTopology: true
    });

    const db = mongoClient.db("crystallography");

    const context: any = {
        log: (message: string) => {
            // tslint:disable-next-line
            console.log(message);
        },
        getChanel: (): any => {
            return null;
        },
        QUEUE_NAME: 'QUEUE_NAME',
        db
    };

    // tslint:disable-next-line
    console.time('process-files');

    await processMessage({
        structureId: 1000000, context
    });

    // tslint:disable-next-line
    console.timeEnd('process-files');
})();
