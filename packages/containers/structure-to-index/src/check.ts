import type { Channel } from 'amqplib';
import { getMongoConnection } from './common/mongo.js';
import { processMessage } from './process.js';
import type { AppContext } from './app.js';

(async () => {
  const { db } = await getMongoConnection();

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
    chanel: null as unknown as Channel,
    QUEUE_NAME: 'QUEUE_NAME',
    db,
  };

  console.time('process-files');

  // wrong sg - 4518380
  await processMessage({
    structureId: 4323099,
    context,
  });

  console.timeEnd('process-files');

  process.exit(0);
})();
