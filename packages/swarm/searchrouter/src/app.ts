import express from "express";
const http = require("http");
const Queue = require("bee-queue");
import {
    Db,
} from "mongodb";

import { initExpress } from "./app.express";
import { initIO } from "./app.io";
import { initQueue } from "./app.queue";

export async function startServer(db: Db) {
    const app = express();
    const server = http.createServer(app);
    const queue = new Queue("substructure-search", {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PWD,
        },
        isWorker: false,
        removeOnSuccess: true,
        removeOnFailure: true,
    });

    /*-- Socket IO --*/
    const io = initIO(server, db, queue);

    /*-- Queue --*/
    initQueue(io, db, queue);

    /*-- Express --*/
    await initExpress(app, queue, db);

    return server;
}
