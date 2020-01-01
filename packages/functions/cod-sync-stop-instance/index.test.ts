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
import { codSyncStopInstance } from './index';


describe('Cod Sync Start Instance', () => {
  beforeEach(()=> {

  });
  test('should define function', ()=> {
    expect(codSyncStopInstance).toBeDefined();
  });

  test('should call getVms method and reture all is OK', async ()=> {
      const res = await codSyncStopInstance(null, null);
      expect(computeMockInstance.getVMs).toHaveBeenCalled();
      expect(res).toBeDefined();
  });

  test('function should fail in case can not fetch resources', async ()=> {
      computeMockInstance.getVMs = jest.fn(()=> Promise.reject([[]]));
      let error;
      try {
        await codSyncStopInstance(null, null);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
  });


  test('should start instances by provided ids', async ()=> {
      computeMockInstance.getVMs = jest.fn(()=> Promise.resolve([[{ name: 'name', zone: { id: 'zone-id' }}]]));
      await codSyncStopInstance(null, null);

      expect(computeMockInstance.zone).toHaveBeenCalledWith('zone-id');
      expect(computeMockInstance.vm).toHaveBeenCalledWith('name');
      expect(computeMockInstance.stop).toHaveBeenCalled();
  });
});
