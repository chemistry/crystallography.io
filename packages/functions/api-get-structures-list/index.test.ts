import {
  DB_CONTENT,
  API_RESPONSE
} from './fixtures';

import { handler } from './index';

let originalConsoleInfo = console.info;
let originalConsoleError = console.error;

class mockRes {
    public statusContent: number = -1;
    public contentContent: any = "";

    public status(stat: number) {
      this.statusContent = stat;
      return this;
    }

    public json(content: any) {
      this.contentContent = content;
      return this;
    }

    public send(content: string) {
      this.contentContent = content;
      return this;
    }
}

jest.mock('@google-cloud/firestore', () => {
    return {
        Firestore: function() {

          const MockFirebase = require('mock-cloud-firestore/dist/mock-cloud-firestore');
          const mockFirebase = new MockFirebase(DB_CONTENT);
          const mockFiretore =  mockFirebase.firestore();
          const _collOriginal = mockFiretore.collection;
          mockFiretore.collection = function(collectionName: string) {
              const obj = _collOriginal.call(this, collectionName);
              obj.limit = () => obj;
              obj.offset = () => obj;
              return obj;
          }
          return mockFiretore;
        }
    }
});

describe('Get Structures List', () => {

  beforeEach(()=> {
      jest.clearAllMocks();
      console.info = () => {}
      console.error = () => {}
  });
  afterEach(()=> {
      console.info = originalConsoleInfo;
      console.error = originalConsoleError;
  });

  test('should define apiGetStructuresList function', ()=> {
      expect(handler).toBeDefined();
  });

  test('it should rerurn 400 in case page is negative', ()=> {
      const req: any = { query: { page: -1} };
      const res: any = new mockRes();
      handler(req, res);

      expect(res.statusContent).toEqual(400);
  });

  test('it should rerurn 400 in case page is > 99999', ()=> {
      const req: any = { query: { page: 100000} };
      const res: any = new mockRes();
      handler(req, res);

      expect(res.statusContent).toEqual(400);
  });

  test('it should respond with items from collection', async ()=> {
      const req: any = { query: { page: 1} };
      const res: any = new mockRes();
      await handler(req, res);

      expect(res.contentContent).toEqual(API_RESPONSE);
  });
});
