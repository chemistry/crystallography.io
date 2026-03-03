import express, { Express } from "express";
import * as Sentry from "@sentry/node";
import http from "http";
import { Queue, QueueEvents } from "bullmq";
import { Db } from "mongodb";

import { initExpress } from "./app.express";
import { initIO } from "./app.io";
import { initQueue } from "./app.queue";

const redisConnection = {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
};

const initSentry = ({ app }: { app: Express }) => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || "",
        integrations: [],
        tracesSampleRate: 1.0,
    });
};

export async function startServer({ db, mw, hc }: { db: Db, mw: any, hc: any }) {
    const app = express();
    const server = http.createServer(app);

    const queue = new Queue("substructure-search", {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
        },
    });

    const queueEvents = new QueueEvents("substructure-search", {
        connection: redisConnection,
    });

    initSentry({ app });

    app.use("/", hc);
    app.use(mw);

    process.on("SIGINT", async () => {
        await queue.close();
        await queueEvents.close();
    });

    /*-- Socket IO --*/
    const io = initIO(server, db, queue);

    /*-- Queue --*/
    initQueue(io, db, queue, queueEvents);

    /*-- Express --*/
    await initExpress(app, queue, db);

    return server;
}
