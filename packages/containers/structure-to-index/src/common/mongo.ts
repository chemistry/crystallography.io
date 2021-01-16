import { MongoClient } from "mongodb";

export const  getMongoConnection = async () => {
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
    const close = ()=> {
        return mongoClient.close();
    }

    const db = mongoClient.db("crystallography");

    process.on('SIGTERM', () => {
        mongoClient.close();
    });

    return { db, close };
}
