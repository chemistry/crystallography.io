import * as Sentry from '@sentry/node';
import * as shell from 'shelljs';
import type { ExecOptions, ShellString } from 'shelljs';
import { app } from './app';
import type { AppContext } from './app';
import { getLogger } from './common/logger';
import { getMongoConnection } from './common/mongo';
import { getChanel } from './common/rabbitmq';

const READ_QUEUE_NAME = 'COD_FILE_CHANGED';
const NOTICE_WRITE_QUEUE = 'STRUCTURE_CHANGED';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  tracesSampleRate: 1.0,
});

const getContext = async (): Promise<AppContext> => {
  const chanel = await getChanel(READ_QUEUE_NAME);
  const { db } = await getMongoConnection();
  const logger = await getLogger();

  process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
    logger.trace(`About to exit with code: ${code}`);
  });

  return {
    logger,
    getChanel: () => {
      return chanel;
    },
    exec: (command: string, _options?: ExecOptions & { async?: false }): ShellString => {
      return shell.exec(command);
    },
    sendNoticeToQueue: async (data: object): Promise<void> => {
      chanel.sendToQueue(NOTICE_WRITE_QUEUE, Buffer.from(JSON.stringify(data)));
    },
    db,
    QUEUE_NAME: READ_QUEUE_NAME,
  };
};

(async () => {
  try {
    const context = await getContext();

    console.time('application start');
    await app(context);

    console.timeEnd('application start');
  } catch (e: any) {
    Sentry.captureException(e);
    console.error(e);
    process.exit(-1);
  }
})();
