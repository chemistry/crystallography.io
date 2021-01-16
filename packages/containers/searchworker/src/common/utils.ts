import { getMongoConnection } from './mongo';
import { getRedisClient } from './reddis';

export const checkConnection = async () => {

    const { close } = await getMongoConnection();
    await close();

    const { close: closeRedis } = await getRedisClient();
    await closeRedis();
}
