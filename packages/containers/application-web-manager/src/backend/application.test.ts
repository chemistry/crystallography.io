const request = require('supertest');
import { startApplication } from './application';

describe("Express Application", () => {
    let mockContext: any = {
      log: () => {},
      PORT: '8080',
      applicationManager: {
        getPlugins: jest.fn().mockResolvedValue([])
      },
      platform: {
          addPlugins: jest.fn().mockResolvedValue(''),
          initialize: jest.fn().mockResolvedValue(''),
          getContent: jest.fn().mockResolvedValue({ statusCode: 200, content: '' }),
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


    test("application manager should be called with provided url", async() => {
        const { app } = await startApplication(mockContext);
        const URL = '/SOME-URL';
        await request(app).get(URL);
        expect(mockContext.applicationManager.getPlugins).toHaveBeenCalledWith({
            url: URL
        });
    });

    test('plugins from appmanager should be added to platform', async () => {
        const MOCK_PLUGIN = {
          initialize: jest.fn()
        };
        mockContext.applicationManager.getPlugins = jest.fn().mockResolvedValue([MOCK_PLUGIN]);
        const { app } = await startApplication(mockContext);
        const URL = '/SOME-URL';
        await request(app).get(URL);

        expect(mockContext.platform.addPlugins).toHaveBeenCalledWith([MOCK_PLUGIN])
    });

    test('platform initialize should be called', async () => {
        const { app } = await startApplication(mockContext);
        const URL = '/SOME-URL';
        await request(app).get(URL);
        expect(mockContext.platform.initialize).toHaveBeenCalled();
    });

    test('should respond with platform content', async () => {
        mockContext.platform.getContent = jest.fn().mockResolvedValue({
          statusCode: 202, content: 'SOME-CONTENT'
        });
        const { app } = await startApplication(mockContext);
        const response = await request(app).get('/');
        const { statusCode, text } = response;

        expect(statusCode).toEqual(202);
        expect(text).toEqual('SOME-CONTENT');
    });
});
