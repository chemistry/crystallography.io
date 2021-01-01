import * as dotenv from "dotenv";
import {
    Db,
    MongoClient,
} from "mongodb";
import {
    startServer,
} from "./app";

dotenv.config({
    path: ".env.default",
});

(async () => {
    try {
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
            useNewUrlParser: true
        });

        const db = client.db("crystallography");
        const server = await startServer(db);

        server.listen(3000, () => {
            // tslint:disable-next-line
            console.log((new Date().toLocaleString()), " searchrouter ", "started on port 3000");
        });
        server.on("error", (err: any) => {
          // tslint:disable-next-line
          console.error(err);
        });

    } catch (e) {
        // tslint:disable-next-line
        console.error(e);
    }
})();

process.on("uncaughtException", (err) => {
    // tslint:disable-next-line
    console.error('uncaughtException: ', err.message);
    // tslint:disable-next-line
    console.error(err.stack);
});

process.on("SIGINT", () => {
    // tslint:disable-next-line
    console.log(`Received SIGINT`);
});

process.on("SIGTERM", () => {
    // tslint:disable-next-line
    console.log(`Received SIGTERM`);
});
