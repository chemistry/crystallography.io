import type { Db } from 'mongodb';
import { Router } from 'express';
import { getStructureRouter } from './structure/index.js';
import { getCatalogRouter } from './catalog/index.js';
import { getAuthorRouter } from './authors/index.js';
import { getSearchRouters } from './search/index.js';
import { getAutocompleteRouters } from './autocomplete/index.js';
import { getSitemapRouters } from './sitemap/index.js';
import { getCifDataRouter } from './cif/index.js';

export const getRouters = ({ db }: { db: Db }) => {
  const router = Router();

  router.use('/api/v1/structure', getStructureRouter({ db }));
  router.use('/api/v1/catalog', getCatalogRouter({ db }));
  router.use('/api/v1/authors', getAuthorRouter({ db }));
  router.use('/api/v1/search', getSearchRouters({ db }));
  router.use('/api/v1/autocomplete', getAutocompleteRouters({ db }));
  router.use('/cif/', getCifDataRouter());
  router.use('/', getSitemapRouters({ db }));

  return router;
};
