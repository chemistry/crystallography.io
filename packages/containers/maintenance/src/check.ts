import { AppContext } from "./app";
import { getLogger } from "./common/logger";
import { getMongoConnection } from "./common/mongo";
import { processMessage } from "./process";

const getMockContext = async (): Promise<AppContext> => {

    const { db, close } = await getMongoConnection();
    const { log } = await getLogger();

    return {
        logger: {
            info: (message: object) => {
                // tslint:disable-next-line
                console.log(message);
                log(JSON.stringify(message));
                return Promise.resolve();
            },
            error: (message: object) => {
                // tslint:disable-next-line
                console.log(message);
                log(JSON.stringify(message));
                return Promise.resolve();
            },
            setTraceId: (id: string)=> {
                // tslint:disable-next-line
                console.log(id);
            }
        },
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
