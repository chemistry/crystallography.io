import { Db } from 'mongodb';
import { ExecOptions, ShellString } from 'shelljs';
import { CodFileRecord, processMessage } from './process';

export interface AppContext {
    logger: {
        trace:(message: string) => void;
        info: (message: string) => void;
        error: (message: string) => void;
    },
    getChanel: () => any;
    QUEUE_NAME: string;
    db: Db;
    sendNoticeToQueue: (data: object) => Promise<void>;
    exec: (command: string, options?: ExecOptions & { async?: false }) => ShellString;
}

export const app = async(context: AppContext) => {
    const { logger, getChanel, sendNoticeToQueue, QUEUE_NAME } = context;
    const chanel = getChanel();

    chanel.consume(QUEUE_NAME, async (originalMessage: any) => {
        const messages: CodFileRecord[] = JSON.parse(originalMessage.content.toString());
        for (const message of messages) {
            await processMessage({ ...message, context });

            if (message && message.codId && isFinite(Number(message.codId))) {
                const { codId } = message;
                await sendNoticeToQueue({ structureId: Number(codId) });
            } else {
                // tslint:disable-next-line
                logger.info(JSON.stringify(message));
            }
        }
        chanel.ack(originalMessage);
    }, { noAck: false });

    logger.info('---------------------------------------------------');
}
