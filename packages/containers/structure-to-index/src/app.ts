import * as Sentry from '@sentry/node';
import type { Channel, ConsumeMessage } from 'amqplib';
import type { Db } from 'mongodb';
import { processMessage } from './process.js';

export interface AppContext {
  logger: {
    trace: (message: string) => void;
    info: (message: string) => void;
    error: (message: string) => void;
  };
  QUEUE_NAME: string;
  chanel: Channel;
  db: Db;
}

export const app = async (context: AppContext) => {
  const { logger, chanel, QUEUE_NAME } = context;

  chanel.consume(
    QUEUE_NAME,
    async (originalMessage: ConsumeMessage | null) => {
      if (!originalMessage) {
        return;
      }
      const message = JSON.parse(originalMessage.content.toString());
      const { structureId } = message;

      await Sentry.startSpan({ name: 'process message', op: 'structure-to-index' }, async () => {
        await processMessage({ structureId, context });
      });

      chanel.ack(originalMessage);
    },
    { noAck: false }
  );

  logger.trace('---------------------------------------------------');
};
