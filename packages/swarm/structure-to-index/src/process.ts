import { AppContext } from "./app";
import { processAuthorsIndex } from "./author";


export const processMessage = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log } = context;

    log(`processing index for: ${structureId}`);
    await processAuthorsIndex({ structureId, context });
}
