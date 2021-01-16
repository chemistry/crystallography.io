import * as fs from "fs";
import { Db } from "mongodb";
import * as os from "os";
import * as path from "path";

import { Request, Response } from "express";
const packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"));
const { name, version } = packageJSON;

export function healthCheck({ db, queue }: { db: Db, queue: any }): (req: Request, res: Response) => void {
    return (req: Request, res: Response) => {
        res.header("Content-Type", "application/json");
        const writeFail = () => {
            res.status(500).send(JSON.stringify({
                status: "FAIL",
            }, null, 4)).end();
        };
        const writeOK = () => {
            res.status(200).send(JSON.stringify({
                status: "OK",
            }, null, 4)).end();
        };

        (async () => {
            try {

              const [
                  queueStat,
                  mongoCheck,
              ] = await Promise.all([
                  queue.checkHealth(),
                  db.stats(),
              ]);
              if (queueStat.active > -1 && mongoCheck.ok) {
                  writeOK();
              } else {
                writeFail();
              }
            } catch (err) {
                // tslint:disable-next-line
                console.error(err);
                writeFail();
            }
        })();
    };
}

export function statusCheck({ db, queue }: { db: Db, queue: any }): (req: Request, res: Response) => void {

  return (req: Request, res: Response) => {
        const writeFail = () => {
            res.status(500).send(JSON.stringify({
                status: "FAIL",
            }, null, 4)).end();
        };
        res.header("Content-Type", "application/json");

        (async () => {
            try {
                const [
                    queueStat,
                    mongoCheck,
                ] = await Promise.all([
                    queue.checkHealth(),
                    db.stats(),
                ]);

                res.status(200).send(JSON.stringify({
                    status: "OK",
                    name,
                    version,
                    pid: process.pid,
                    memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + "M",
                    uptime: process.uptime(),
                    NODE_ENV: process.env.NODE_ENV,
                    hostname: os.hostname(),
                    queue: queueStat,
                }, null, 4)).end();

            } catch (err) {
              // tslint:disable-next-line
              console.error(err);
              writeFail();
            }
        })();
    };
}
