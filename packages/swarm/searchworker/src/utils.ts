import { MongoClient } from 'mongodb';
import { createClient } from "redis";

export const checkConnection = async () => {
    const {
        MONGO_INITDB_ROOT_USERNAME,
        MONGO_INITDB_ROOT_PASSWORD,
        MONGO_INITDB_HOST
    }  = process.env;

    let connectionString = `mongodb://${MONGO_INITDB_HOST}`;
    if (MONGO_INITDB_ROOT_USERNAME && MONGO_INITDB_ROOT_PASSWORD) {
        connectionString  = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_INITDB_HOST}:27017`;
    }

    const client = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    client.close();

    const redisClient = createClient({
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT  ? Number(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD || ''
    });

    redisClient.quit();
}
