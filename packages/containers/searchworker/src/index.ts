import * as Sentry from "@sentry/node";
import cluster from "cluster";
import os from "os";

import { SearchStatisticsModel } from "./models";
import { startWorker } from "./server";
import { checkConnection } from "./common/utils";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    (async () => {
        try {
            await checkConnection();

            const statistics: SearchStatisticsModel[] = [];
            console.log(`${new Date().toLocaleString()} searchworker:master started with pid ${process.pid} on ${numCPUs} cpus`);

            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on("exit", (worker: any) => {
                console.error(`worker ${worker.process.pid} died`);
            });

            cluster.on('fork', (worker: any) => {
                console.error(`${new Date().toLocaleString()} searchworker:master - fork event; isDead: ${worker.isDead()}`);
            });

        } catch (e) {
            Sentry.captureException(e);
            console.error(String(e));
            process.exit(-1);
        }
    })();
} else {
    startWorker();
}

process.on("uncaughtException", (err) => {
    console.error('uncaughtException: ', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on("SIGINT", () => {
    console.log(`Received SIGINT`);
});

process.on("SIGTERM", () => {
    console.log(`Received SIGTERM`);
});
