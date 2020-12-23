import { AppContext } from "./app";


export const processMessage = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log } = context;

    log(`index -message received: ${structureId}`);
}
