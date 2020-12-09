import { MongoClient } from 'mongodb';
import { processMessage } from './process';

// tslint:disable-next-line
(async ()=> {
    // tslint:disable-next-line
    console.time('app-execution');

    const mongoClient = await MongoClient.connect('mongodb://localhost', {
        useNewUrlParser: true
    });
    const db = mongoClient.db("crystallography");

    const context: any = {
        log: (message: string) => {
            // tslint:disable-next-line
            console.log(message);
        },
        getChanel: (): any => {
            return null;
        },
        QUEUE_NAME: 'QUEUE_NAME',
        db
    };

    await processMessage(context)({
        fileName: '/home/data/cif/2/24/36/2243694.cif', codId: '2243694'
    });
    // tslint:disable-next-line
    console.timeEnd('app-execution');
})();
