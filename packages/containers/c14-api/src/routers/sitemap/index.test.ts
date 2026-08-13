import express from 'express';
import request from 'supertest';
import type { Db } from 'mongodb';
import { getSitemapRouters } from './index.js';

const mockDb = () =>
  ({
    collection: () => ({
      countDocuments: async () => 2,
      findOne: async () => ({ _id: 1, structures: [111, 222] }),
    }),
  }) as unknown as Db;

// Body is streamed before the status is set, so the wire status is always 200 -
// the request log reads res.statusCode, which is what must be asserted.
const buildApp = (logged: { status?: number }) => {
  const app = express();
  app.use((_req, res, next) => {
    res.on('finish', () => {
      logged.status = res.statusCode;
    });
    next();
  });
  app.use('/', getSitemapRouters({ db: mockDb() }));
  return app;
};

describe('crystallography-api sitemap', () => {
  it('logs the static sitemap as 200', async () => {
    const logged: { status?: number } = {};
    const res = await request(buildApp(logged)).get('/sitemap/sitemap_s.xml');
    expect(res.text).toContain('crystallography.io/authors');
    expect(logged.status).toBe(200);
  });

  it('logs a structures sitemap page as 200', async () => {
    const logged: { status?: number } = {};
    const res = await request(buildApp(logged)).get('/sitemap/sitemap1.xml');
    expect(res.text).toContain('/structure/111');
    expect(logged.status).toBe(200);
  });

  it('logs the sitemap index as 200', async () => {
    const logged: { status?: number } = {};
    const res = await request(buildApp(logged)).get('/sitemap.xml');
    expect(res.text).toContain('/sitemap/sitemap_s.xml');
    expect(logged.status).toBe(200);
  });
});
