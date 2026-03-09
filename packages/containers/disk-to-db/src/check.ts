import type { Channel } from 'amqplib';
import { MongoClient } from 'mongodb';
import type { ShellString } from 'shelljs';
import { processMessage } from './process.js';
import type { AppContext } from './app.js';

(async () => {
  /* mongodb.crystallography.io */
  const mongoClient = new MongoClient('mongodb://root:random@localhost:27017');
  await mongoClient.connect();
  const db = mongoClient.db('crystallography');

  const context: AppContext = {
    logger: {
      trace: (message: string) => {
        console.log(message);
      },
      info: (message: string) => {
        console.log(message);
      },
      error: (message: string) => {
        console.error(message);
      },
    },
    getChanel: () => {
      return null as unknown as Channel;
    },
    sendNoticeToQueue: async () => {},
    exec: () => {
      return '' as unknown as ShellString;
    },
    QUEUE_NAME: 'QUEUE_NAME',
    db,
  };

  const processMessage2243694 = async () => {
    await processMessage({
      fileName: '/home/data/cif/2/24/36/2243694.cif',
      codId: '2243694',
      context,
    });
  };
  const processMessage7701497 = async () => {
    await processMessage({
      fileName: '/home/data/cif/7/70/14/7701497.cif',
      codId: '7701497',
      context,
    });
  };
  console.time('process-files');

  await processMessage2243694();
  await processMessage7701497();

  console.timeEnd('process-files');
})();
