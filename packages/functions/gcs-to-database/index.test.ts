import { STRUCTURE_1000004 } from './mocks';

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

class mockFireStore {
    public static instance: any = null;
    public doc: any;
    public set: any;

    constructor() {
      if (mockFireStore.instance) {
        return mockFireStore.instance;
      }
      mockFireStore.instance = this;
      this.doc = jest.fn(() => this);
      this.set = jest.fn(() => Promise.resolve());
    }
}

jest.mock('@google-cloud/storage', () => {
    return {
        Storage: mockStorage
    }
});

jest.mock('@google-cloud/firestore', () => {
    return {
        Firestore: mockFireStore
    }
});

let mockStructure = STRUCTURE_1000004;
const mockFS = {
  ...jest.requireActual("fs"),
  readFile: jest.fn((name, cb) => {
      cb(null, mockStructure);
  }),
  unlink: jest.fn((name, cb) => {
      cb();
  })
}
jest.mock('fs', () => {
    return mockFS;
});
import { getGCSAndStoreToDataBase } from './index';


let originalConsoleInfo = console.info;
let originalConsoleError = console.error;

describe('GCS to database', () => {

  beforeEach(()=> {
      mockStructure = STRUCTURE_1000004;
      jest.clearAllMocks();
      console.info = () => {}
      console.error = () => {}
  });
  afterEach(()=> {
      console.info = originalConsoleInfo;
      console.error = originalConsoleError;
  });

  test('should define function', ()=> {
      expect(getGCSAndStoreToDataBase).toBeDefined();
  });

  test('GSC should download files from buket', async ()=> {
      await getGCSAndStoreToDataBase({
        name: "cif/4/06/02/4060224.cif"
      } as any);
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

  test('GCS should ignore hkl file changes ', async ()=> {
    await getGCSAndStoreToDataBase({
      name: "hkl/4/06/02/4060224.hkl"
    } as any);
    expect(mockFS.readFile).not.toHaveBeenCalled();
  });

  test('GCS should throw when id is not encoded in filename', async ()=> {
    let thrown = false;
    try {
      await getGCSAndStoreToDataBase({
        name: "cif/4/06/02/_.cif"
      } as any);
    } catch (e) {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  test('GCS should throw in case empty file is provided', async ()=> {
      mockStructure = "";
      let thrown = false;
      try {
        await getGCSAndStoreToDataBase({
          name: "cif/4/06/02/4060224.cif"
        } as any);
      } catch (e) {
        thrown = true;
      }
      expect(thrown).toBe(true);
  });

});
