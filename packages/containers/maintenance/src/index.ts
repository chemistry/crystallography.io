import * as fs from "fs";
import * as path from "path";
import { app, AppContext } from "./app";
import { getMongoConnection } from "./common/mongo";
import { getLogger } from "./common/logger";


const getContext = async (): Promise<AppContext> => {
    const packagePath = path.resolve(__dirname, "../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());

    const { db, close } = await getMongoConnection();
    const logger = await getLogger();

    process.on('exit', (code) => {
         // tslint:disable-next-line
        console.log(`About to exit with code: ${code}`);
    });

    const meta = {
        version: packageJSON.version,
        service: packageJSON.name,
    };

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
        const context = await getContext();

        // tslint:disable-next-line
        console.time('application start');
        await app(context);

        // tslint:disable-next-line
        console.timeEnd('application start');
    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
