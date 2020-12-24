import { AppContext } from "./app";
import { processAuthorsIndex } from "./author";
import { processNamesIndex } from "./name";


export const processMessage = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log } = context;

    await processAuthorsIndex({ structureId, context });
    await processNamesIndex({ structureId, context });

    log(`processing index for: ${structureId}`);
}
