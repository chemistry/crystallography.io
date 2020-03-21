import { getApplicationManager } from './application.manager';

describe("Application Factory", ()=> {
    test('should app manager with coresponding API', ()=> {
        const sut = getApplicationManager();

        expect(sut).toEqual(
          expect.objectContaining({
            getPlugins: expect.any(Function)
          })
        );
    });

});
