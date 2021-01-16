import { Db } from 'mongodb';
import { processMessage } from './process';

export interface AppContext {
    log: (text: string) => void;
    QUEUE_NAME: string;
    chanel: any;
    db: Db;
}

export const app = async(context: AppContext) => {
    const { log, chanel, QUEUE_NAME } = context;

    chanel.consume(QUEUE_NAME, async (originalMessage: any) => {
        const message = JSON.parse(originalMessage.content.toString());
        const { structureId } = message;

        await processMessage({ structureId, context });

        chanel.ack(originalMessage);
    }, { noAck: false });

    log('---------------------------------------------------');
}
