const request = require('supertest');
import * as React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { startApplication } from './application';

describe("Express Application", () => {

    let mockContext: any = {
        log: () => {},
        onAppStart: ()=> {},
        PORT: '8080',
        htmlContent: '<html><div id="root"></div></html>',
        appContext: null,
        appFactory: () => {
            const Routes = [{
                component: () => React.createElement("h1", null, 'App')
            }];
            const mockSlice = createSlice({
              name: "structures",
              initialState: [],
              reducers: { },
            });
            const getStore = ()=> {
               return configureStore({
                  reducer: {
                    structures: mockSlice.reducer
                  }
               })
            }
            return Promise.resolve({ Routes, getStore });
        }
    };

    test("should export start application", async() => {
        await startApplication(mockContext);
    });

    test("should return application with 200 for / ", async () => {
        const { app } = await startApplication(mockContext);
        const response = await request(app).get('/');
        const { statusCode, header } = response;

        expect(statusCode).toEqual(200);
        expect(header['content-type']).toEqual('text/html; charset=utf-8');
    });

    test("should render simplest application content", async ()=> {
        const { app } = await startApplication(mockContext);
        const response = await request(app).get('/');
        const { text } = response;

        expect(text).toEqual('<html><div id="root"><h1>App</h1></div></html>');
    });
});
