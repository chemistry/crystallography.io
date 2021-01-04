import { Middleware } from "@reduxjs/toolkit";
import { Dispatch } from "react";

let io: any;
if (process.env.BROWSER) {
    // tslint:disable-next-line
    io = require('socket.io-client');
}
const WS_PATH = process.env.WS_PATH || '';
let socket: any = null;


export const UPDATE_RESULTS_BY_SOCKET = 'UPDATE_RESULTS_BY_SOCKET';
export const CLOSE_SOCKET_ACTION = 'CLOSE_SOCKET_ACTION';
export const CHECK_IF_SOCKET_UPDATES_REQUIRED = 'CHECK_IF_SOCKET_UPDATES_REQUIRED';

export const closeSocketAction = (params = {}) => {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: CLOSE_SOCKET_ACTION,
        });
    };
}

export const updateResultsBySocket = (data: any) => {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: UPDATE_RESULTS_BY_SOCKET,
            response: data,
        });
    };
}

export const checkIfSocketUpdateRequired = (data: any) => {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: CHECK_IF_SOCKET_UPDATES_REQUIRED,
        });
    };
}

export const wsMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);
    if (!process.env.BROWSER) {
        return result;
    }
    // tslint:disable-next-line
    console.log(action);

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
        socket = io(WS_PATH, {
            // transports: ['websocket'],
            // upgrade: false,
            path: '/api/v1/live',
        });
    }
}
