import type { AppContext } from './app';
import { getLogger } from './common/logger';
import { getMongoConnection } from './common/mongo';
import { processMessage } from './process';

const getMockContext = async (): Promise<AppContext> => {
  const { db, close } = await getMongoConnection();
  const logger = await getLogger();

  return {
    logger,
    close: () => {
      return close();
    },
    db,
  };
};

(async () => {
  try {
    const context = await getMockContext();

    console.time('message processed');
    await processMessage({ context });

    context.close();
    console.timeEnd('message processed');
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
})();
