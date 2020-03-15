import { getPlatformAPI } from './platform-api';

describe("Frontend API: Platform", ()=> {
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
