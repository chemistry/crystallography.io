import * as Sentry from '@sentry/node';
import type { Document } from 'mongodb';
import type { AppContext } from './app.js';

const CATALOG_PAGE_SIZE = 100;
const SITEMAP_PAGE_SIZE = 1000;

export const processMessage = async ({ context }: { context: AppContext }) => {
  try {
    const { db } = context;

    const ids: number[] = await db
      .collection('structures')
      .find(
        {},
        {
          sort: { _id: 1 },
          projection: { _id: 1 },
        }
      )
      .map((doc) => Number(doc._id))
      .toArray();

    const structureCatalogDocs = [];
    for (let i = 0; i < Math.ceil(ids.length / CATALOG_PAGE_SIZE); i++) {
      const structures = ids.slice(i * CATALOG_PAGE_SIZE, (i + 1) * CATALOG_PAGE_SIZE);
      structureCatalogDocs.push({
        _id: i + 1,
        order: 'id',
        structures,
      });
    }
    await db.collection('catalog').deleteMany({});
    await db.collection('catalog').insertMany(structureCatalogDocs as Document[]);

    // save sitemap catalog
    const sitemapDocs = [];
    for (let i = 0; i < Math.ceil(ids.length / SITEMAP_PAGE_SIZE); i++) {
      const structures = ids.slice(i * SITEMAP_PAGE_SIZE, (i + 1) * SITEMAP_PAGE_SIZE);
      sitemapDocs.push({
        _id: i + 1,
        structures,
      });
    }

    await db.collection('sitemap').deleteMany({});
    await db.collection('sitemap').insertMany(sitemapDocs as Document[]);
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
  }
};
