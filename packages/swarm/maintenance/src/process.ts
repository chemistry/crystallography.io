import { Db, MongoClient } from "mongodb";
import { AppContext } from "./app";


export const processMessage = async ({ context }: { context: AppContext}) => {
    try {
        const { logger } = context;

        logger.info({ text: 'processing message .... ' });

    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
    }
}

