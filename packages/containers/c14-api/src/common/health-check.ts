import { Request, Response, Router } from "express";
import { Db } from "mongodb";

const writeFail = (res: Response) => {
    res.status(500).send(JSON.stringify({
        status: "FAIL",
    }, null, 4)).end();
};

const writeOK = (res: Response) => {
    res.status(200).send(JSON.stringify({
        status: "OK",
    }, null, 4)).end();
};

export const mongoCheck = ({ db }: { db: Db }) => {
    return async () => {
        const check = await db.stats();
        if (check.ok) {
            return Promise.resolve();
        }
        return Promise.reject();
    }
}

// health check
export const  healthCheck = (checks: (()=>Promise<void>)[]) => {
    const router = Router();

    router.get("/hc", async (req: Request, res: Response) => {
        res.header("Content-Type", "application/json");
        try {
            await Promise.all([...checks]);
            writeOK(res);
        } catch(err) {
            writeFail(res);
            // tslint:disable-next-line
            console.error(err);
        }
    });
    return router;
}
