import { getGCSAndStoreToDataBase } from './index';

describe('GCS to database', () => {
  test('should define function', ()=> {
    expect(getGCSAndStoreToDataBase).toBeDefined();
  });
});
