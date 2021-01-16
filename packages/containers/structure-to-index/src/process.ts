import { AppContext } from "./app";
import { processAuthorsIndex } from "./author";
import { processNamesIndex } from "./name";
import { processFormulaIndex } from "./formula";
import { processUnitCellIndex } from "./unitcell";
import { processFragments } from './fragments';

export const processMessage = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { logger } = context;

    const start = Date.now();
    logger.trace(`processing - start - index for: ${structureId}`);

    await processAuthorsIndex({ structureId, context });
    await processNamesIndex({ structureId, context });
    await processFormulaIndex({ structureId, context });
    await processUnitCellIndex({ structureId, context });
    await processFragments({ structureId, context });

    const end = Date.now() - start;
    logger.trace(`processing of ${structureId} took  ${end} ms`);
}
