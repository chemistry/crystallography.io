import * as Sentry from "@sentry/node";
import {
    Db,
} from "mongodb";
import {
    QueueHelperController,
} from "./helpers";
import {
    ChunkStatusModel,
    JobOutputModel,
} from "./models";

export function initQueue(io: any, db: Db, queue: any) {
    /*-- Queue  ---------------------------------------------------------------------------*/
    queue.on("job succeeded", (jobId: number, result: JobOutputModel) => {
        processWorkerResponse(io, db, jobId, result, ChunkStatusModel.finished);
    });

    queue.on("job failed", (jobId: number, result: JobOutputModel) => {
        processWorkerResponse(io, db, jobId, result, ChunkStatusModel.failed);
    });
}

async function processWorkerResponse(
    io: any,
    db: Db,
    jobId: number,
    result: JobOutputModel,
    status: ChunkStatusModel,
) {


    let version = 0;
    try {
        version = await QueueHelperController.saveWorkerResponse({ db, result, status });
    } catch (error) {
        Sentry.captureException(error);
        // tslint:disable-next-line
        console.error(error);
    }

    for (let page = 1; page < 400; page++) {
        const roomName = result.searchId + "-" + page;
        const sockets = io.nsps["/"].adapter.rooms[roomName];
        if (sockets) {
            const { searchId, results } = result;
            // tslint:disable-next-line
            const response = await QueueHelperController.getSocketUpdate({
                db,
                searchId,
                fromVersion: version - 1,
                page,
            });
            io.to(roomName).emit("results-update", response);
        }
    }
}
