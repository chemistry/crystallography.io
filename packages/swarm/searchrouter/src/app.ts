import express from "express";
const http = require("http");
const Queue = require("bee-queue");
import {
    Db,
} from "mongodb";

import { initExpress } from "./app.express";
import { initIO } from "./app.io";
import { initQueue } from "./app.queue";

export async function startServer({ db, mw } : { db: Db, mw: any }) {
    const app = express();
    const server = http.createServer(app);
    const queue = new Queue("substructure-search", {
        redis: {
            host: process.env.REDIS_HOST || 'redis',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || ''
        },
        isWorker: false,
        removeOnSuccess: true,
        removeOnFailure: true,
    });

    app.use(mw);

    process.on("SIGINT", () => {
        queue.close();
    });

    /*-- Socket IO --*/
    const io = initIO(server, db, queue);

    /*-- Queue --*/
    initQueue(io, db, queue);

    /*-- Express --*/
    await initExpress(app, queue, db);

    return server;
}
