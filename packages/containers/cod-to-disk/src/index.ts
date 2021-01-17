import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { Readable } from "stream";
import * as shell from "shelljs";
import { ShellString, ExecOptions } from "shelljs";
import { app, AppContext } from "./app";
import { getChanel } from "./common/rabbitmq";
import { getLogger } from "./common/logger";

const QUEUE_NAME = 'COD_FILE_CHANGED';

Sentry.init({
    dsn: "https://528c0dac31fb4f658075becf9bcd05d5@o187202.ingest.sentry.io/5595531",
    tracesSampleRate: 1.0,
});

const getContext = async (): Promise<AppContext> => {

    const logger = await getLogger();
    const chanel = await getChanel(QUEUE_NAME);

    process.on('exit', (code) => {
        // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
    });

    return {
        logger,
        exec: (command: string, options?: ExecOptions & { async?: false }): ShellString => {
            return shell.exec(command);
        },
        execAsync: (command: string): Readable => {
            return shell.exec(command, { async:true }).stdout;
        },
        sendToQueue: (data: object): void => {
            chanel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)));
        }
    }
}

(async () => {
    try {
        const context = await getContext();

        // tslint:disable-next-line
        console.time('application start');
        await app(context);

        // tslint:disable-next-line
        console.timeEnd('application start');
    } catch(e) {
        Sentry.captureException(e);
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
