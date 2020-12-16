import { MongoClient } from 'mongodb';
import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import cors from "cors";
import express from "express";
import { getRouters } from "./routers";

export interface ExpressContext {
    log: (message: string) => void;
    PORT: number;
}

const  getMongoConnection = async () => {
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

    return db;
}

export async function startApplication(context: ExpressContext) {
    const { log } = context;
    log("application started");

    const app = express();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(cors());

    app.use(timeout("10s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Serve static files
    app.get("/", (req, res) => {
      res.send("api/: OK");
    });

    app.get("/api", (req, res) => {
        res.send("api: OK");
    });
    const db = await getMongoConnection();

    app.use("/api/v1", getRouters({ db }));

    app.use((err: any, req: any, res: any, next: any) => {
        // tslint:disable-next-line
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    return { app };
}
