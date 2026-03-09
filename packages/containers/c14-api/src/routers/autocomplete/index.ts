import { Router } from 'express';
import type { Db } from 'mongodb';
import { getAuthorAutocompleteRouter } from './author.js';
import { getNameAutocompleteRouter } from './name.js';

export const getAutocompleteRouters = ({ db }: { db: Db }) => {
  const router = Router();

  router.use('/name', getNameAutocompleteRouter({ db }));
  router.use('/author', getAuthorAutocompleteRouter({ db }));

  return router;
};
