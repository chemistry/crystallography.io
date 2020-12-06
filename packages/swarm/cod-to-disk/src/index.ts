// Imports the Google Cloud client library
import * as shell from "shelljs";
import { App, AppContext } from "./app";

// tslint:disable-next-line
console.time("Synchronization Action");

const appContext: AppContext = {
    log: (message: string) => {
        // tslint:disable-next-line
        console.log(message);
    },
    exec: (command: string) => {
        return shell.exec(command);
    },
};

App(appContext)
    .then(() => {
        // tslint:disable-next-line
        console.timeEnd("Synchronization Action");
    })
    .catch((e) => {
        // tslint:disable-next-line
        console.error(e);
        process.exit(-1);
    });
