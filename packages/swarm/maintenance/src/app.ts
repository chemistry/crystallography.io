import { Db } from 'mongodb';
import * as cron from 'node-cron'
import { processMessage } from './process';

export interface AppContext {
    logger: {
        info: (message: object) => Promise<void>;
        error: (message: object) => Promise<void>;
        setTraceId: (id: string) => void;
    },
    db: Db;
    close: ()=> Promise<void>;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // tslint:disable-next-line
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
    });
}

export const app = async(context: AppContext) => {
    const { logger } = context;

    cron.schedule('00 36 */1 * * *', async () => {
        logger.setTraceId(uuidv4());
        logger.info({
            'text': 'job executed',
        });

        const start = +new Date();
        await processMessage({ context });

        const end = +new Date();

        logger.info({
            'text': `processed in ${end-start}`,
            'time': (end-start)
        });
    });

    logger.info({
        'text': 'subscribed cron events',
    });
}
