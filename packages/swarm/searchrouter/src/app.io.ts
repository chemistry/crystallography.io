const socketIO = require("socket.io");
import {
    Db,
} from "mongodb";
import {
    QueueHelperController,
} from "./helpers";

export function initIO(server: any, db: Db, queue: any): any {
    const io = socketIO(server, {
        path: "/api/v1/live",
    });

    io.on("connect", (socket: any) => {
        socket.on("get:results-update", ({ id, version, page }: {
            id: string, version: string, page: string,
        }) => {
            if (id && page) {
                const lastRoom = socket.lastRoom;
                const roomName = id + "-" + page;
                socket.lastRoom = roomName;
                socket.join(roomName);
                if (lastRoom && lastRoom !== roomName) {
                    socket.leave(lastRoom);
                }

                if (version) {
                    QueueHelperController.getSocketUpdate({
                        db,
                        searchId: id,
                        fromVersion: Number(version),
                        page: Number(page),
                    })
                    .then((message) => {
                        if (message) {
                            io.to(roomName).emit("results-update", message);
                        }
                    });
                }
            }
        });

        socket.on("disconnect", () => {
            const lastRoom = socket.lastRoom;

            if (lastRoom) {
                const searchId: string = lastRoom.split("-")[0];
                QueueHelperController.cancelSearchChunks({
                    searchId,
                    db,
                    queue,
                });
            }
        });
    });
    return io;
}
