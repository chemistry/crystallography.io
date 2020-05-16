const request = require('supertest');
const express = require('express');
const MockFirebase = require('mock-cloud-firestore/dist/mock-cloud-firestore');

import { getStructureRouter } from './index';
import { DB_CONTENT, API_RESPONSE } from './fixtures';


const mockFirebase = new MockFirebase(DB_CONTENT);
const mockFiretore =  mockFirebase.firestore();
const _collOriginal = mockFiretore.collection;
mockFiretore.collection = function(collectionName: string) {
    const obj = _collOriginal.call(this, collectionName);
    obj.limit = () => obj;
    obj.offset = () => obj;
    return obj;
}

let originalConsoleInfo = console.info;
let originalConsoleError = console.error;

describe('structure.router', () => {
    const app = express();
    const router = getStructureRouter({ firestore: mockFiretore});
    app.use("/", router);

    beforeEach(()=> {
        jest.clearAllMocks();
        console.info = () => {}
        console.error = () => {}
    });
    afterEach(()=> {
        console.info = originalConsoleInfo;
        console.error = originalConsoleError;
    });

    test('should build router',() => {
        expect(router).toBeDefined();
    });

    test("should return 400 for pages with wrong page #", async () => {
        const response = await request(app).get('/?page=-1');
        const { statusCode, header } = response;

        expect(statusCode).toEqual(400);
    });

    test("should return 400 for pages with wrong page  > 99999", async () => {
        const response = await request(app).get('/?page=-100000');
        const { statusCode, header } = response;

        expect(statusCode).toEqual(400);
    });

    test('it should respond with items from collection', async ()=> {
        const response = await request(app).get('/');
        const { statusCode, header, text } = response;
        const res = JSON.parse(text);
        expect(res).toEqual(API_RESPONSE);
    });
});
