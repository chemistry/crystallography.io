import { getMongoConnection } from './mongo.js';
import { getRedisClient } from './reddis.js';

export const checkConnection = async () => {
  const { close } = await getMongoConnection();
  await close();

  const { close: closeRedis } = await getRedisClient();
  await closeRedis();
};
