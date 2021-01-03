import * as fs from "fs";
import * as path from "path";
import { AppContextType, ApplicationContext, getApplication } from "../common";
import { startApplication } from "./application";

// tslint:disable-next-line
console.time("Context Prepare");

const htmlContent = fs.readFileSync(
  path.join(__dirname, "/../static/index.html"),
"utf8");

const appContext: ApplicationContext =  {
   type: AppContextType.backend,
};

const context = {
    log: (message: string) => {
        // tslint:disable-next-line
        console.log(message);
    },
    PORT: (() => {
        const port = process.env.PORT;
        if (port && isFinite(parseInt(port, 10))  && parseInt(port, 10) > 0) {
            return parseInt(port, 10);
        }
        return 8080;
    })(),
    appFactory: getApplication,
    htmlContent,
    appContext,
};

// tslint:disable-next-line
console.timeEnd("Context Prepare");

// tslint:disable-next-line
console.time("App Start");
(async () => {
    try {
        await new Promise(res => setTimeout(res, 20000));

        const { app } = await startApplication(context);
        const { PORT, log } = context;

        await new Promise((resolve) => {
            app.listen(PORT, "0.0.0.0", resolve);
        });

        log(`Application Started on port: ${PORT}`);
        // tslint:disable-next-line
        console.timeEnd("App Start");
    } catch (e) {
      // tslint:disable-next-line
      console.error(e);
    }
})();
