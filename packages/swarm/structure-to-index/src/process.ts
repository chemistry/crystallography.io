import { AppContext } from "./app";
import { processAuthorsIndex } from "./author";
import { processNamesIndex } from "./name";
import { processFormulaIndex } from "./formula";
import { processUnitCellIndex } from "./unitcell";
import { processFragments } from './fragments';

export const processMessage = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log } = context;

    log(`processing - start - index for: ${structureId}`);

    await processAuthorsIndex({ structureId, context });
    await processNamesIndex({ structureId, context });
    await processFormulaIndex({ structureId, context });
    await processUnitCellIndex({ structureId, context });
    await processFragments({ structureId, context });

    log(`processing - end - index for: ${structureId}`);
}
