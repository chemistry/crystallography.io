// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";
import * as shell from "shelljs";
import { App, AppContext } from "./app";

// tslint:disable-next-line
console.time("Syncronization Action");

const appContext: AppContext = {
   pubsub: new PubSub(),
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
    console.timeEnd("Syncronization Action");
  })
  .catch((e) => {
    // tslint:disable-next-line
    console.error(e);
  });
