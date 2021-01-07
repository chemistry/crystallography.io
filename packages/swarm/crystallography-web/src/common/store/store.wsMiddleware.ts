import { Middleware } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { updateSearchResults } from "./search-results.slice";

let io: any;
if (process.env.BROWSER) {
    // tslint:disable-next-line
    io = require('socket.io-client');
}
let socket: any = null;


export const UPDATE_RESULTS_BY_SOCKET = 'UPDATE_RESULTS_BY_SOCKET';
export const SUBSCRIBE_WS_UPDATES = 'SUBSCRIBE_WS_UPDATES';
export const CLOSE_WS_SUBSCRIPTION = 'CLOSE_WS_SUBSCRIPTION';

export const closeWSSubscription = (params = {}) => {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: CLOSE_WS_SUBSCRIPTION,
        });
    };
}

export const subscribeToWSUpdates = () => {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: SUBSCRIBE_WS_UPDATES,
        });
    };
}

export const wsMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    if (!process.env.BROWSER) {
        return result;
    }

    if (
        action.type === SUBSCRIBE_WS_UPDATES ||
        action.type === "searchResults/searchResultsSuccess"
    ) {
        const { dispatch } = store;
        const {
            id, status, version, page,
        } = store.getState().searchResults.meta;

        // Search results success
        if (status === 'processing' || status === 'created') {
            if (!socket) {
                openSocket();

                socket.on('results-update', (res: any) => {

                    dispatch(updateSearchResults(res) as any);

                    if (
                        res.meta.status === 'finished' &&
                        res.meta.id === id
                    ) {
                        closeSocket();
                    }
                });
            }
            socket.emit('get:results-update', { id, page, version });
        } else {
            closeSocket();
        }
    }

    if (action.type === CLOSE_WS_SUBSCRIPTION) {
        const {
            id, page,
        } = store.getState().searchResults.meta;
        if (socket) {
            socket.emit('cancel:results-update', { id, page });
        }
        closeSocket();
    }

    if (
        action.type ===  "searchResults/searchResultsFailed"
    ) {
        closeSocket();
    }

    return result;
}

const closeSocket = ()=> {
    if (socket) {
        socket.close();
        socket = null;
    }
}

const openSocket = ()=> {
    if (!socket) {
        socket = io('https://crystallography.io', {
            // transports: [], // 'polling','websocket'
            // upgrade: false,
            path: '/api/v1/live',
        });
    }
}
