import { AppContext } from "./app";
import { processAuthorsIndex } from "./author";
import { processNamesIndex } from "./name";
import { processFormulaIndex } from "./formula";
import { processUnitCellIndex } from "./unitcell";

export const processMessage = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log } = context;

    await processAuthorsIndex({ structureId, context });
    await processNamesIndex({ structureId, context });
    await processFormulaIndex({ structureId, context });
    await processUnitCellIndex({ structureId, context })

    log(`processing index for: ${structureId}`);
}
