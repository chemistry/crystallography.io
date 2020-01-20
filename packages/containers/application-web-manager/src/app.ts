import * as express from "express";

export interface AppContext {
  log: (message: string) => void;
  PORT: number;
}

export async function startApplication(context: AppContext) {
    const { log, PORT } = context;
    const app = express();

    app.get("/", (req, res) => {
        res.end("hi");
    });

    await new Promise((resolve) => {
      app.listen(PORT, "0.0.0.0", () => {
          resolve(app);
      });
    });

    log("Application Started");
}
