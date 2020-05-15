import { spawn } from "child_process";
import { app } from "electron";
import * as fs from "fs";
import * as tty from "tty";
import { run } from "./app";

if (process.env.CLI_RUN || !tty.isatty((process.stdout as any).fd)) {
  run();
} else {
   const env: NodeJS.ProcessEnv = {...process.env, CLI_RUN: "1" };
   const out = fs.openSync("/dev/null", "a");
   const err = fs.openSync("/dev/null", "a");
   const child = spawn(process.execPath, process.argv.slice(1), {detached: true, env, stdio: ["ignore", out, err]});
   child.unref();
   app.quit();
}
