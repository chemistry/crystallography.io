import * as express from "express";
import { AppContext } from "./app";

export async function startApplication(context: AppContext) {
    const { log, PORT } = context;
    const app = express();

    return { app };
}
