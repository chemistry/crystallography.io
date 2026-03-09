import request from 'supertest';
import { createElement } from 'react';
import { startApplication } from './application.js';
import type { ExpressContext } from './application.js';

describe('Express Application', () => {
  const noop = (_name: string) => {};
  const mockContext: ExpressContext = {
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
      const routes = [
        {
          path: '/',
          element: () => createElement('h1', null, 'App'),
          title: 'Test',
          description: 'Test',
        },
      ];
      return Promise.resolve({ routes });
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

    expect(text).toContain('<h1>App</h1>');
  });
});
