import express, { Express } from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing"
const http = require("http");
const Queue = require("bee-queue");

import {
    Db,
} from "mongodb";

import { initExpress } from "./app.express";
import { initIO } from "./app.io";
import { initQueue } from "./app.queue";


const initSentry = ({ app }: { app: Express })=> {
    Sentry.init({
        dsn: "https://6b267d143384483792e6aa59c19a5383@o187202.ingest.sentry.io/5595516",
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
    });
}

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
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());


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

    app.use(Sentry.Handlers.errorHandler());

    return server;
}
