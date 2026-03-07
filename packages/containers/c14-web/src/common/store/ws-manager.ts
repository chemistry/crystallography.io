import type { AppStore } from './create-app-store';

let socket: any = null;

const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

const openSocket = (io: any) => {
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

      socket.on('results-update', (res: any) => {
        store.getState().updateSearchResults(res);

        if (res.meta.status === 'finished' && res.meta.id === id) {
          closeSocket();
        }
      });
    }
    socket.emit('get:results-update', { id, page, version });
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
