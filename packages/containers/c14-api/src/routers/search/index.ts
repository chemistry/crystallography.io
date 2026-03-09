import { Router } from 'express';
import type { Db } from 'mongodb';
import { getNameSearchRouter } from './name.js';
import { getAuthorSearchRouter } from './author.js';
import { getFormulaSearchRouter } from './formula.js';
import { getUnitCellSearchRouter } from './unit-cell.js';

export const getSearchRouters = ({ db }: { db: Db }) => {
  const router = Router();

  router.use('/name', getNameSearchRouter({ db }));
  router.use('/author', getAuthorSearchRouter({ db }));
  router.use('/formula', getFormulaSearchRouter({ db }));
  router.use('/unit-cell', getUnitCellSearchRouter({ db }));

  return router;
};
