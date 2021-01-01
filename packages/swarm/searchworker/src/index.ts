const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const http = require("http");

import * as dotenv from "dotenv";
import {
   SearchStatisticsModel,
} from "./models";
import { startWorker } from "./server";


dotenv.config({
    path: ".env.default",
});

if (cluster.isMaster) {

    const statistics: SearchStatisticsModel[] = [];
    // tslint:disable-next-line
    console.log((new Date().toLocaleString()), " searchworker:master ", "started with pid " + process.pid + " on " + numCPUs + " cpus");

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
    }

    cluster.on("exit", (worker: any) => {
        // tslint:disable-next-line
        console.error(`worker ${worker.process.pid} died`);
    });
} else {

    // Start Worker
    startWorker();

    // tslint:disable-next-line
    console.log((new Date().toLocaleString()), " searchworker:fork ", "started with pid " + process.pid);
}

process.on("uncaughtException", (err) => {
    // tslint:disable-next-line
    console.error('uncaughtException: ', err.message);
    // tslint:disable-next-line
    console.error(err.stack);
    process.exit(1);
});

process.on("SIGINT", () => {
    // tslint:disable-next-line
    console.log(`Received SIGINT`);
});

process.on("SIGTERM", () => {
    // tslint:disable-next-line
    console.log(`Received SIGTERM`);
});
