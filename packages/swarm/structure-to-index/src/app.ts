import { Db } from 'mongodb';
import { processMessage } from './process';

export interface AppContext {
  log: (message: string) => void;
  getChanel: () => any;
  QUEUE_NAME: string;

  db: Db;
}

export const app = async(context: AppContext) => {
    const { log, getChanel, QUEUE_NAME } = context;
    const chanel = getChanel();

    chanel.consume(QUEUE_NAME, async (originalMessage: any) => {
        const message = JSON.parse(originalMessage.content.toString());
        const { structureId } = message;

        await processMessage({ structureId, context });

        chanel.ack(originalMessage);
    }, { noAck: false });

    log('---------------------------------------------------');
}
