import Redis from 'ioredis';

export const getRedisClient = async () => {
  const client = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  const close = () => {
    return client.quit();
  };

  return { client, close };
};
