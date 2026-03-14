import * as Sentry from '@sentry/node';
import type { Readable } from 'node:stream';
import shell from 'shelljs';
import type { ShellString } from 'shelljs';
import type { ExecOptions } from 'shelljs';
import { app } from './app.js';
import type { AppContext } from './app.js';
import { getChanel } from './common/rabbitmq.js';
import { getLogger } from './common/logger.js';

const QUEUE_NAME = 'COD_FILE_CHANGED';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  tracesSampleRate: 1.0,
});

const getContext = async (): Promise<AppContext> => {
  const logger = await getLogger();
  const chanel = await getChanel(QUEUE_NAME);

  process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
  });

  return {
    logger,
    exec: (command: string, _options?: ExecOptions & { async?: false }): ShellString => {
      return shell.exec(command);
    },
    execAsync: (command: string): Readable => {
      return shell.exec(command, { async: true }).stdout!;
    },
    sendToQueue: (data: object): void => {
      chanel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)));
    },
  };
};

(async () => {
  try {
    const context = await getContext();

    console.time('application start');
    await app(context);

    console.timeEnd('application start');
  } catch (e: unknown) {
    Sentry.captureException(e);
    console.error(e);
    process.exit(-1);
  }
})();
