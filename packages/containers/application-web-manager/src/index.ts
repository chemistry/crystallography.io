import { AppContext, startApplication } from "./app";

// tslint:disable-next-line
console.time("App Start");

const appContext: AppContext = {
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
};

startApplication(appContext)
  .then(() => {
    // tslint:disable-next-line
    console.timeEnd("App Start");
  })
  .catch((e) => {
    // tslint:disable-next-line
    console.error(e);
  });
