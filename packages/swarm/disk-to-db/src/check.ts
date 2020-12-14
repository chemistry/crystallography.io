import { MongoClient } from 'mongodb';
import { processMessage } from './process';

// tslint:disable-next-line
(async ()=> {
    // tslint:disable-next-line

    /* mongodb.crystallography.io */
    const mongoClient = await MongoClient.connect('mongodb://root:random@localhost:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true
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

    const processMessage2243694 = async ()=> {
        await processMessage({
            fileName: '/home/data/cif/2/24/36/2243694.cif', codId: '2243694', context
        });
    }
    const processMessage7701497 = async ()=> {
        await processMessage({
            fileName: '/home/data/cif/7/70/14/7701497.cif', codId: '7701497', context
        });
    }
    // tslint:disable-next-line
    console.time('process-files');

    await processMessage2243694();
    await processMessage7701497();

    // tslint:disable-next-line
    console.timeEnd('process-files');
})();
