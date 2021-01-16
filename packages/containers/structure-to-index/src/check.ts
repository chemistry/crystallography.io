import { getMongoConnection } from './common/mongo';
import { processMessage } from './process';

// tslint:disable-next-line
(async ()=> {
    // tslint:disable-next-line

    const db = await getMongoConnection();
    const chanel: any = null;

    const context: any = {
        log: (message: string) => {
            // tslint:disable-next-line
            console.log(message);
        },
        chanel,
        QUEUE_NAME: 'QUEUE_NAME',
        db
    };

    // tslint:disable-next-line
    console.time('process-files');

    // wrong sg - 4518380
    await processMessage({
        structureId: 4323099, context
    });

    // tslint:disable-next-line
    console.timeEnd('process-files');

    process.exit(0);
})();
