const request = require('supertest');
import { startApplication } from './app';

describe("Express Application", () => {
    let mockContext: any = {
        log: () => {},
        PORT: '8080'
    };

    test("should export start application", async() => {
        await startApplication(mockContext);
    });

    test("should return application with 200 for / ", async () => {
        const { app } = await startApplication(mockContext);
        const response = await request(app).get('/');
        const { statusCode, header } = response;

        expect(statusCode).toEqual(200);
    });
});
