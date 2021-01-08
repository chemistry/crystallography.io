const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const http = require("http");

import {
   SearchStatisticsModel,
} from "./models";
import { startWorker } from "./server";
import { checkConnection } from "./utils";


if (cluster.isMaster) {

    (async ()=> {
        try {
            // Check connection
            await checkConnection();

            const statistics: SearchStatisticsModel[] = [];
            // tslint:disable-next-line
            console.log(`${new Date().toLocaleString()} searchworker:master started with pid ${process.pid} on ${numCPUs} cpus`);

            // Fork workers.
            for (let i = 0; i < numCPUs; i++) {
                const worker = cluster.fork();
            }

            cluster.on("exit", (worker: any) => {
                // tslint:disable-next-line
                console.error(`worker ${worker.process.pid} died`);
            });

            cluster.on('fork', (worker: any) => {
                // tslint:disable-next-line
                console.error(`${new Date().toLocaleString()} searchworker:master - fork event; isDead: ${worker.isDead()}`);
            });

            cluster.on('exit', (worker: any) => {
                // tslint:disable-next-line
                console.error(`${new Date().toLocaleString()} searchworker:master - exit event; isDead: ${worker.isDead()}`);
            });

        } catch (e) {
            // tslint:disable-next-line
            console.error(String(e))
            process.exit(-1);
        }
    })();
} else {

    // Start Worker
    startWorker();

    // tslint:disable-next-line
    console.log(`${new Date().toLocaleString()} searchworker:fork started with pid ${process.pid}`);
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
