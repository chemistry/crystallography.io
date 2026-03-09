import type { AppStore } from './create-app-store.js';
import type { SearchResultsMeta } from './slices/search-results.slice.js';

interface WSResultsUpdate {
  meta: SearchResultsMeta;
  data: { results: number[] };
}

interface SocketInstance {
  close: () => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  emit: (event: string, data: Record<string, unknown>) => void;
}

let socket: SocketInstance | null = null;

const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

const openSocket = (io: (url: string, opts: { path: string }) => SocketInstance) => {
  if (!socket) {
    socket = io('https://crystallography.io', {
      path: '/api/v1/live',
    });
  }
};

export const subscribeToWSUpdates = async (store: AppStore) => {
  if (typeof window === 'undefined') {
    return;
  }

  const io = (await import('socket.io-client')).default;
  const { id, status, version, page } = store.getState().searchResults.meta;

  if (status === 'processing' || status === 'created') {
    if (!socket) {
      openSocket(io);
    }

    if (socket) {
      socket.on('results-update', (data: unknown) => {
        const res = data as WSResultsUpdate;
        store.getState().updateSearchResults(res);

        if (res.meta.status === 'finished' && res.meta.id === id) {
          closeSocket();
        }
      });

      socket.emit('get:results-update', { id, page, version });
    }
  } else {
    closeSocket();
  }
};

export const closeWSSubscription = (store: AppStore) => {
  if (typeof window === 'undefined') {
    return;
  }

  const { id, page } = store.getState().searchResults.meta;
  if (socket) {
    socket.emit('cancel:results-update', { id, page });
  }
  closeSocket();
};
