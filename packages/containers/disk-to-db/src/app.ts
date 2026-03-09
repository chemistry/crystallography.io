import * as Sentry from '@sentry/node';
import type { Channel, ConsumeMessage } from 'amqplib';
import type { Db } from 'mongodb';
import type { ExecOptions, ShellString } from 'shelljs';
import { processMessage } from './process.js';
import type { CodFileRecord } from './process.js';

export interface AppContext {
  logger: {
    trace: (message: string) => void;
    info: (message: string) => void;
    error: (message: string) => void;
  };
  getChanel: () => Channel;
  QUEUE_NAME: string;
  db: Db;
  sendNoticeToQueue: (data: object) => Promise<void>;
  exec: (command: string, options?: ExecOptions & { async?: false }) => ShellString;
}

export const app = async (context: AppContext) => {
  const { logger, getChanel, sendNoticeToQueue, QUEUE_NAME } = context;
  const chanel = getChanel();

  chanel.consume(
    QUEUE_NAME,
    async (originalMessage: ConsumeMessage | null) => {
      if (!originalMessage) {
        return;
      }
      const messages: CodFileRecord[] = JSON.parse(originalMessage.content.toString());
      for (const message of messages) {
        await Sentry.startSpan({ name: 'process message', op: 'disk-to-db' }, async () => {
          await processMessage({ ...message, context });

          if (message && message.codId && isFinite(Number(message.codId))) {
            const { codId } = message;
            await sendNoticeToQueue({ structureId: Number(codId) });
          } else {
            logger.info(JSON.stringify(message));
          }
        });
      }
      chanel.ack(originalMessage);
    },
    { noAck: false }
  );

  logger.info('---------------------------------------------------');
};
