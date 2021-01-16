import * as fs from "fs";
import * as path from "path";
import { Express } from "express";
import { AppContextType, ApplicationContext, getApplication } from "../common";
import { startApplication } from "./application";
import { getLogger } from "./common/logger";

// tslint:disable-next-line
console.time("Context Prepare");

const htmlContent = fs.readFileSync(
  path.join(__dirname, "/../static/index.html"),
"utf8");

const appContext: ApplicationContext =  {
   type: AppContextType.backend,
};

const getPort = () => {
    const port = process.env.PORT;
    if (port && isFinite(parseInt(port, 10))  && parseInt(port, 10) > 0) {
        return parseInt(port, 10);
    }
    return 8080;
}

const getContext = async () => {
    const { mw, logger }  = await getLogger();
    const PORT = getPort();

    return {
        logger: {
            trace:(message: string) => {
                // tslint:disable-next-line
                console.log(message);
                logger.trace(message);
            },
            info: (message: string) => {
                // tslint:disable-next-line
                console.log(message);
                logger.info(message);
            },
            error: (message: string) => {
                // tslint:disable-next-line
                console.error(message);
                logger.error(message);
            }
        },
        PORT,
        onAppStart: (app: Express)=> {
            app.use(mw);
        },
        appFactory: getApplication,
        htmlContent,
        appContext,
    };
}

// tslint:disable-next-line
console.timeEnd("Context Prepare");

// tslint:disable-next-line
console.time("App Start");
(async () => {
    try {
        const context = await getContext();
        const { PORT, logger } = context;
        const { app } = await startApplication(context);

        await new Promise<void>((resolve) => {
            app.listen(PORT, "0.0.0.0", resolve);
        });

        logger.trace(`Application Started on port: ${PORT}`);
        // tslint:disable-next-line
        console.timeEnd("App Start");
    } catch (e) {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    }
})();
