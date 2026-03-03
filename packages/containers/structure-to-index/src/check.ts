import { getMongoConnection } from './common/mongo';
import { processMessage } from './process';

(async ()=> {

    const db = await getMongoConnection();
    const chanel: any = null;

    const context: any = {
        log: (message: string) => {
            console.log(message);
        },
        chanel,
        QUEUE_NAME: 'QUEUE_NAME',
        db
    };

    console.time('process-files');

    // wrong sg - 4518380
    await processMessage({
        structureId: 4323099, context
    });

    console.timeEnd('process-files');

    process.exit(0);
})();
