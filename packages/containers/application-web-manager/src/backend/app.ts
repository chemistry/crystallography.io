import * as express from "express";
import * as path from "path";
import { componentHTML } from "./renderer";

export interface AppContext {
  log: (message: string) => void;
  PORT: number;
}

export async function startApplication(context: AppContext) {
    const { log, PORT } = context;
    const app = express();
    // add UTF-8 symbols parser
    app.set("query parser", "simple");

    // Remove header
    app.disable("x-powered-by");

    app.use(express.static(path.join(__dirname, "/../static"), { index: false }));

    app.get("/", (req, res) => {
        res.end(componentHTML);
    });

    await new Promise((resolve) => {
      app.listen(PORT, "0.0.0.0", () => {
          resolve(app);
      });
    });

    log(`Application Started on port: ${PORT}`);
}
