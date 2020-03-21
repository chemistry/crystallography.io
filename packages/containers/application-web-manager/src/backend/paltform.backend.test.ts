import { Platform, Plugin } from '../interfaces';
import { getPlatfom } from './paltform.backend';

describe("Backend Platform", ()=> {
    let sut: Platform;
    beforeEach(()=> {
        sut = getPlatfom();
    });

    test('should return platrofm API object', ()=> {
        expect(sut).toEqual(
          expect.objectContaining({
            addPlugin: expect.any(Function),
            initialize: expect.any(Function),
          })
        );
    });

    test('should call initialize on all registred plugins', async ()=> {
        const mockPlugin1: Plugin = {
            initialize: jest.fn()
        };
        const mockPlugin2: Plugin = {
            initialize: jest.fn()
        };

        await sut.addPlugin(mockPlugin1);
        await sut.addPlugin(mockPlugin2);
        await sut.initialize();

        expect(mockPlugin1.initialize).toHaveBeenCalled();
        expect(mockPlugin2.initialize).toHaveBeenCalled();
    });


    test('should throw error on add plugin in case addition alredy made', async ()=> {
        const mockPlugin1: Plugin = {
            initialize: jest.fn()
        };
        const mockPlugin2: Plugin = {
            initialize: jest.fn()
        };

        await sut.addPlugin(mockPlugin1);
        await sut.initialize();

        let thrown = false;

        try {
            await sut.addPlugin(mockPlugin2);
        } catch (e) {
            thrown = true;
        }
        expect(thrown).toEqual(true);
    });

    test('plugin initialization should be executed with context matching api', async ()=> {
        const mockPlugin1: Plugin = {
            initialize: jest.fn()
        };
        await sut.addPlugin(mockPlugin1);
        await sut.initialize();

        expect(mockPlugin1.initialize).toHaveBeenCalledWith(expect.objectContaining({
          name: expect.any(String),
          type: expect.any(String),
          version: expect.any(String),
          registerView: expect.any(Function),
          registerResources: expect.any(Function),
          registerIndexHtml: expect.any(Function)
        }));

    });
});
