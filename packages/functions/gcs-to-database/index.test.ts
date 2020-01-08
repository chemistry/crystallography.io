class mockStorage {
    public static instance: any = null;
    public bucket: any;
    public file: any;
    public download: any;

    constructor() {
        if (mockStorage.instance) {
           return mockStorage.instance;
        }
        mockStorage.instance = this;
        this.bucket = jest.fn(() => this);
        this.file = jest.fn(() => this);
        this.download = jest.fn(() => Promise.resolve());
    }
}
jest.mock('@google-cloud/storage', () => {
    return {
        Storage: mockStorage
    }
});
const mockFS =  {
  readFile: jest.fn((name, cb)=> {
      cb(null, "empty string");
  }),
  unlink: jest.fn((name, cb) => {
      cb();
  })
}
jest.mock('fs', () => {
    return mockFS;
});
import { getGCSAndStoreToDataBase } from './index';

describe('GCS to database', () => {
  
  test('should define function', ()=> {
    expect(getGCSAndStoreToDataBase).toBeDefined();
  });

  test('GSC should download files from buket', async ()=> {
      await getGCSAndStoreToDataBase({
        name: "cif/4/06/02/4060224.cif"
      } as any);
      expect(mockStorage.instance.bucket).toHaveBeenCalledWith("cod-data");
      expect(mockStorage.instance.file).toHaveBeenCalledWith("cif/4/06/02/4060224.cif");
      expect(mockStorage.instance.download).toHaveBeenCalled();
  });

  test('GSC should read file content', async ()=> {
    await getGCSAndStoreToDataBase({
      name: "cif/4/06/02/4060224.cif"
    } as any);
    expect(mockFS.readFile).toHaveBeenCalled();
  });

  test('GSC should unlink file after work is done', async ()=> {
    await getGCSAndStoreToDataBase({
      name: "cif/4/06/02/4060224.cif"
    } as any);
    expect(mockFS.unlink).toHaveBeenCalled();
  });



});
