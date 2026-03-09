import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import type http from 'node:http';
import type { Db } from 'mongodb';
import type { Queue } from 'bullmq';
import { QueueHelperController } from './helpers/index.js';

export function initIO(server: http.Server, db: Db, queue: Queue): Server {
  const io = new Server(server, {
    path: '/api/v1/live',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket & { lastRoom?: string }) => {
    socket.on(
      'get:results-update',
      ({ id, version, page }: { id: string; version: string; page: string }) => {
        if (id && page) {
          const lastRoom = socket.lastRoom;
          const roomName = id + '-' + page;
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
            }).then((message) => {
              if (message) {
                io.to(roomName).emit('results-update', message);
              }
            });
          }
        }
      }
    );

    socket.on('disconnect', () => {
      const lastRoom = socket.lastRoom;

      if (lastRoom) {
        const searchId: string = lastRoom.split('-')[0];
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
