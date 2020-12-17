import * as fs from "fs";
import * as path from "path";


const TOPIC = 'SCHEDULER_CATALOG';
export interface AppContext {
  log: (message: string) => void;
  sendToQueue: (data: object) => void;
  version: string;
}

const getContext = async (): Promise<AppContext> => {
    const packagePath = path.resolve(__dirname, "../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());

    const connection = await require('amqplib').connect('amqp://rabbitmq');
    const chanel = await connection.createChannel();
    await chanel.assertQueue(TOPIC);

    process.on("uncaughtException", (err) => {
        // tslint:disable-next-line
        console.error('uncaughtException: ', err.message);
        // tslint:disable-next-line
        console.error(err.stack);
        process.exit(1);
    });

    process.on('exit', (code) => {
         // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
        chanel.close();
    });

    return {
        log: (message: string) => {
            // tslint:disable-next-line
            console.log(message);
        },
        sendToQueue: (data: object): void => {
            chanel.sendToQueue(Buffer.from(JSON.stringify(data)));
        },
        version: packageJSON.version
    }
}

(async () => {
    try {
        // tslint:disable-next-line
        console.time('application start');

        const eventName = process.argv.slice(2) || '';

        const { sendToQueue , log } = await getContext();

        sendToQueue({
            time: new Date()
        });
        log('sending event to Queue');


        // tslint:disable-next-line
        console.timeEnd('application start');
    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
