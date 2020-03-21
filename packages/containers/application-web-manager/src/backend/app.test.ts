import { startApplication } from './app';
const request = require('supertest');

describe('Should export application', () => {

  let mockContext: any;
  beforeEach(()=> {
      mockContext = {
        log: (message: string) => {
            console.log(message);
        },
        platformAPIFactory: () => {
            return {
              name: "backend",
              version: "0.0.1"
            }
        },
        appManagerFactory: ({ url }: { url: string }) => {
            return {
              getApplication: () => {
                 return {} as any;
              },
              getLayout: () => {
                 return {} as any;
              },
            };
        },
        PORT: 8080
      }
  });

  test('should define function', () => {
      expect(startApplication).toBeDefined();
  });

  test('start application without failures', async () => {
      let catched = false;
      try {
          await startApplication(mockContext)
      } catch(e) {
        catched = true;
      }
      expect(catched).toBe(false);
  });
});
