/*
let computeMockInstance: any = null;
jest.mock('@google-cloud/compute', () => {
    return class mockCompute {
        public getVMs: any;
        public zone: any;
        public vm: any;
        public stop: any;

        constructor() {
            computeMockInstance = this;
            this.getVMs = jest.fn(() => Promise.resolve([[]]));
            this.zone = jest.fn(() => this);
            this.vm = jest.fn(() => this);
            this.stop = jest.fn(() => Promise.resolve([ { promise: () => Promise.resolve() }]));
        }
    }
});
*/
import { App } from './app';

class MockPubSub {
  topicName: string;
  topic: any;
  publish: any;

  constructor() {
      this.topic = jest.fn((topicName: string) => {
        this.topicName = topicName;
        return this;
      });
      this.publish = jest.fn(() => Promise.resolve('message-id'));
  }
}


describe('Should export application', () => {
  beforeEach(()=> {

  });
  test('should define function', ()=> {
    expect(App).toBeDefined();
  });

  test('application should execute logs and shell commands', async ()=> {
    const appContext = {
        pubsub: (new MockPubSub() as any) ,
        log: jest.fn(),
        exec: jest.fn(() => ({ code: 0 }))
    };
    await App(appContext);
    expect(appContext.log).toHaveBeenCalled();
    expect(appContext.exec).toHaveBeenCalled();
  });

  describe('shoud fail in case one commnd fileds', ()=> {
    const commnds = [
        'svn update /home/cod/cif',
        'gsutil -m rsync -r /home/cod/cif',
        'svn update /home/cod/hkl',
        'gsutil -m rsync -r /home/cod/hkl'
    ];
    for (let i = 0; i < commnds.length; i++) {
        const cmd = commnds[i];
        const appContext = {
            pubsub: (new MockPubSub() as any) ,
            log: jest.fn(),
            exec: jest.fn((command: string) => (
              { code: command.startsWith(cmd) ? 1 : 0 }
            ))
        };

        test(`application should throw in cse shell execution failed ${(i+1)}`, async ()=> {
            let failed = false;
            try {
              await App(appContext);
            } catch(e) {
              failed = true;
            }
            expect(failed).toBe(true);
        });
    }
  });

  test('application should send shutdown signal when it\'s finised', async ()=> {
      const appContext = {
          pubsub: (new MockPubSub() as any) ,
          log: jest.fn(),
          exec: jest.fn(() => ({ code: 0 }))
      };
      await App(appContext);
      expect(appContext.pubsub.publish).toHaveBeenCalled();
      expect(appContext.pubsub.topic).toHaveBeenCalled();
      expect(appContext.pubsub.topicName).toEqual('cod-sync-schedule-instance-stop');
  });
});
