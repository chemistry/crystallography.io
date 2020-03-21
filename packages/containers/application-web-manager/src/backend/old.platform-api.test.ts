import { getPlatformAPI } from './old.platform-api';

describe("Backend API: Platform", ()=> {
    it('should return platrofm API object', ()=> {
        const sut = getPlatformAPI();
        expect(sut).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            version: expect.any(String),
          })
        );
    });
});
