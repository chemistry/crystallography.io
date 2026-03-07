const request = require('supertest');
import { createElement } from 'react';
import { createStore } from 'zustand/vanilla';
import { startApplication } from './application';

describe('Express Application', () => {
  const noop = (_name: any) => {};
  const mockContext: any = {
    logger: {
      trace: noop,
      info: noop,
      error: noop,
    },
    onAppInit: () => {},
    onAppInitEnd: () => {},
    PORT: '8080',
    htmlContent: '<html><div id="root"></div></html>',
    appContext: null,
    appFactory: () => {
      const Routes = [
        {
          component: () => createElement('h1', null, 'App'),
        },
      ];
      const createAppStore = (initialState?: any) => {
        return createStore(() => ({
          structures: [],
          ...initialState,
        }));
      };
      return Promise.resolve({ Routes, createAppStore });
    },
  };

  test('should export start application', async () => {
    await startApplication(mockContext);
  });

  test('should return application with 200 for / ', async () => {
    const { app } = await startApplication(mockContext);
    const response = await request(app).get('/');
    const { statusCode, header } = response;

    expect(statusCode).toEqual(200);
    expect(header['content-type']).toEqual('text/html; charset=utf-8');
  });

  test('should render simplest application content', async () => {
    const { app } = await startApplication(mockContext);
    const response = await request(app).get('/');
    const { text } = response;

    expect(text).toEqual('<html><div id="root"><h1>App</h1></div></html>');
  });
});
