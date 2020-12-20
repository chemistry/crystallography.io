import { Db } from 'mongodb';
import { processMessage } from './process';

export interface AppContext {
    logger: {
        info: (message: object) => Promise<void>;
        error: (message: object) => Promise<void>;
        setTraceId: (id: string) => void;
    },
    getChanel: () => any;
    QUEUE_NAME: string;
    db: Db;
}

export const app = async(context: AppContext) => {
    const { logger, getChanel, QUEUE_NAME } = context;
    const chanel = context.getChanel();

    chanel.consume(QUEUE_NAME, async (originalMessage: any) => {
        const message = JSON.parse(originalMessage.content.toString());

        const { traceId } = message;
        logger.setTraceId(traceId);

        logger.info({
            'text': 'received message',
            'receivedMessage': message
        });

        const start = +new Date();


        await processMessage({ context });

        const end = +new Date();

        logger.info({
            'text': `processed in ${end-start}`,
            'time': (end-start)
        });

        chanel.ack(originalMessage);
    }, { noAck: false });

    logger.info({
        'text': 'subscribed to updates',
    });
}
