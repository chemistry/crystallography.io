import { MongoClient } from "mongodb";
import { AppContext } from "./app";
import { processMessage } from "./process";

const getMockContext = async (): Promise<AppContext> => {

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

    return {
        logger: {
            info: (message: object) => {
                // tslint:disable-next-line
                console.log(message);
                return Promise.resolve();
            },
            error: (message: object) => {
                // tslint:disable-next-line
                console.log(message);
                return Promise.resolve();
            },
            setTraceId: (id: string)=> {
                // tslint:disable-next-line
                console.log(id);
            }
        },
        getChanel: () => {
            return null;
        },
        close: ()=> {
            return mongoClient.close();
        },
        db,
        QUEUE_NAME: ''
    }
}

(async () => {
    try {
        const context = await getMockContext();

        // tslint:disable-next-line
        console.time('message processed');
        await processMessage({ context });

        context.close();
        // tslint:disable-next-line
        console.timeEnd('message processed');
    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
