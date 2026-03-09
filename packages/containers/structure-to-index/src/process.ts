import * as Sentry from '@sentry/node';
import type { AppContext } from './app.js';
import { processAuthorsIndex } from './author/index.js';
import { processNamesIndex } from './name/index.js';
import { processFormulaIndex } from './formula/index.js';
import { processUnitCellIndex } from './unitcell/index.js';
import { processFragments } from './fragments/index.js';

export const processMessage = async ({
  structureId,
  context,
}: {
  structureId: number;
  context: AppContext;
}) => {
  const { logger } = context;

  const start = Date.now();
  logger.trace(`processing - start - index for: ${structureId}`);
  try {
    await processAuthorsIndex({ structureId, context });
    await processNamesIndex({ structureId, context });
    await processFormulaIndex({ structureId, context });
    await processUnitCellIndex({ structureId, context });
    await processFragments({ structureId, context });
  } catch (e: unknown) {
    logger.error(String(e));
    Sentry.captureException(e);
  }

  const end = Date.now() - start;
  logger.trace(`processing of ${structureId} took  ${end} ms`);
};
