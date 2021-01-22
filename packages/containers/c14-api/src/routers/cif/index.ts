import { Request, Response, Router } from "express";
import { Db } from "mongodb";
import * as Sentry from "@sentry/node";
import path from "path";
import fs from "fs";

const DATA_DIRECTORY = '/home/data';

export const getCifDataRouter = () => {
    const router = Router();

    router.get("/:id", async (req: Request, res: Response) => {

        const fileId = req.params.id || "";
        const file = DATA_DIRECTORY + "/cif/" + normName(fileId);

        fs.stat(file, (err: Error) => {
            if (err) {
                res.status(404);
                res.json({ error: "Not found" });
                // tslint:disable-next-line
                console.error(err);
                return;
            }

            const filename = path.basename(file);
            res.set({
                "Content-Disposition": "attachment; filename=" + filename,
                "Content-Type": "chemical/x-cif",
            });
            const fileStream = fs.createReadStream(file);
            fileStream.pipe(res);
        });
    });

    return router;
};

// Convert 1000003 to /1/00/00/03
function normName(fileId: string): string {
    let retFile = fileId;
    if (fileId.length > 5) {
        retFile = fileId.slice(0, 1) + "/" + fileId.slice(1, 3) + "/" + fileId.slice(3, 5) + "/" + fileId + ".cif";
    }
    return retFile;
}
