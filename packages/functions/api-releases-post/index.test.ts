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

let mockFiretore: any;

jest.mock('@google-cloud/firestore', () => {
    return {
        Firestore: function() {

          const MockFirebase = require('mock-cloud-firestore/dist/mock-cloud-firestore');
          const mockFirebase = new MockFirebase(DB_CONTENT);
          mockFiretore =  mockFirebase.firestore();
          const _collOriginal = mockFiretore.collection;
          mockFiretore.collection = function(collectionName: string) {
              const obj = _collOriginal.call(this, collectionName);
              obj.limit = () => obj;
              obj.offset = () => obj;
              return obj;
          }
          return mockFiretore;
        },
        Timestamp: {
           now: () => new Date()
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

  test('it should rerurn 400 in case application params is not provided', ()=> {
      const req: any = { body: { id: "" } };
      const res: any = new mockRes();
      handler(req, res);

      expect(res.statusContent).toEqual(400);
  });

  test('it should return 400 for invalid version', ()=> {
      const req: any = {
        body: {
          id: 'mdata',
          name: 'cod-search',
          path: 'search',
          version: '0.0.x',
          resources: {}
      }};
      const res: any = new mockRes();
      handler(req, res);

      expect(res.statusContent).toEqual(400);
  });

  test('it should return 200 in case version is not provided', async ()=> {
      const req: any = {
        body: {
          id: 'mdata',
          name: 'cod-search',
          path: 'search',
          resources: {}
      }};
      const res: any = new mockRes();
      await handler(req, res);
      expect(res.statusContent).toEqual(200);
  });

  test('it should increment version in store in case none provided', async ()=> {
      const req: any = {
        body: {
          id: 'mdata',
          name: 'cod-search',
          path: 'search',
          resources: {}
      }};
      const res: any = new mockRes();
      await handler(req, res);

      const attributes = res.contentContent.data[0].attributes;
      expect(attributes.version).toEqual('0.0.2');
  });

  test('it should rerurn 200 for coccrectly provided params', async () => {
      const req: any = {
        body: {
          id: 'mdata',
          name: 'cod-search',
          path: 'search',
          version: '0.0.1',
          resources: {}
      }};
      const res: any = new mockRes();
      await handler(req, res);
      expect(res.statusContent).toEqual(200);
  });

  test('it should store the object in database', async () => {
      const data = {
          id: 'mdata',
          name: 'cod-search',
          path: 'search',
          version: '0.0.1',
          resources: {}
      };
      const req: any = { body: data };
      const res: any = new mockRes();
      await handler(req, res);

      const doc = await mockFiretore
        .collection('releases')
        .doc('mdata')
        .get('mdata');
      const { _data } = doc;
      expect(_data).toEqual(expect.objectContaining({
          id: 'mdata',
          name: 'cod-search',
          path: 'search',
          version: '0.0.1',
          resources: {}
      }));
  });
});
