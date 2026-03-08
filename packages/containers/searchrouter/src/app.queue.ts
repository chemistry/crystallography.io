import * as Sentry from '@sentry/node';
import type { Db } from 'mongodb';
import type { Queue, QueueEvents } from 'bullmq';
import type { Server } from 'socket.io';
import { QueueHelperController } from './helpers';
import { ChunkStatusModel } from './models';
import type { JobOutputModel } from './models';

export function initQueue(io: Server, db: Db, queue: Queue, queueEvents: QueueEvents) {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    const result = typeof returnvalue === 'string' ? JSON.parse(returnvalue) : returnvalue;
    await processWorkerResponse(io, db, jobId, result as JobOutputModel, ChunkStatusModel.finished);
  });

  queueEvents.on('failed', async ({ jobId, failedReason: _failedReason }) => {
    const result: JobOutputModel = {
      searchId: jobId.split(':')[0],
      index: Number(jobId.split(':')[1]),
      results: [],
      time: 0,
    };
    await processWorkerResponse(io, db, jobId, result, ChunkStatusModel.failed);
  });
}

async function processWorkerResponse(
  io: Server,
  db: Db,
  jobId: string,
  result: JobOutputModel,
  status: ChunkStatusModel
) {
  let version = 0;
  try {
    version = await QueueHelperController.saveWorkerResponse({ db, result, status });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
  }

  const rooms = io.sockets.adapter.rooms;
  for (let page = 1; page < 400; page++) {
    const roomName = result.searchId + '-' + page;
    if (rooms.has(roomName)) {
      const response = await QueueHelperController.getSocketUpdate({
        db,
        searchId: result.searchId,
        fromVersion: version - 1,
        page,
      });
      io.to(roomName).emit('results-update', response);
    }
  }
}
