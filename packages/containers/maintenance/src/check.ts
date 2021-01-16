import { AppContext } from "./app";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import { processMessage } from "./process";

const getMockContext = async (): Promise<AppContext> => {

    const { db, close } = await getMongoConnection();
    const logger = await getLogger();

    return {
        logger,
        close: ()=> {
            return close();
        },
        db,
    }
}

(async () => {
    try {
        const context = await getMockContext();

        // tslint:disable-next-line
        console.time('message processed');
        await processMessage({ context });

        context.close();
        // tslint:disable-next-line
        console.timeEnd('message processed');
    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
