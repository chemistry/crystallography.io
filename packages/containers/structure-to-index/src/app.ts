import * as Sentry from "@sentry/node";
import { Db } from 'mongodb';
import { processMessage } from './process';

export interface AppContext {
    logger: {
        trace:(message: string) => void;
        info: (message: string) => void;
        error: (message: string) => void;
    },
    QUEUE_NAME: string;
    chanel: any;
    db: Db;
}

export const app = async(context: AppContext) => {
    const { logger, chanel, QUEUE_NAME } = context;

    chanel.consume(QUEUE_NAME, async (originalMessage: any) => {
        const message = JSON.parse(originalMessage.content.toString());
        const { structureId } = message;

        const transaction = Sentry.startTransaction({
            op: "structure-to-index",
            name: "process message",
        });
        await processMessage({ structureId, context });
        transaction.finish();

        chanel.ack(originalMessage);
    }, { noAck: false });

    logger.trace('---------------------------------------------------');
}
