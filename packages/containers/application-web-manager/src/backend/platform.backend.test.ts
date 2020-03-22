import { Platform, Plugin } from '../interfaces';
import { getPlatfom } from './platform.backend';

describe("Backend Platform", ()=> {
    let sut: Platform;
    beforeEach(()=> {
        sut = getPlatfom();
    });

    test('should return platrofm API object', ()=> {
        expect(sut).toEqual(
          expect.objectContaining({
            addPlugins: expect.any(Function),
            initialize: expect.any(Function),
            getContent: expect.any(Function)
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

        await sut.addPlugins([mockPlugin1, mockPlugin2]);
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

        await sut.addPlugins([mockPlugin1]);
        await sut.initialize();

        let thrown = false;

        try {
            await sut.addPlugins([mockPlugin2]);
        } catch (e) {
            thrown = true;
        }
        expect(thrown).toEqual(true);
    });

    test('plugin initialization should be executed with context matching api', async ()=> {
        const mockPlugin1: Plugin = {
            initialize: jest.fn()
        };
        await sut.addPlugins([mockPlugin1]);
        await sut.initialize();

        expect(mockPlugin1.initialize).toHaveBeenCalledWith(expect.objectContaining({
          name: expect.any(String),
          type: expect.any(String),
          version: expect.any(String),
          addMiddleWare: expect.any(Function)
        }));
    });

    test('Application getContent should return default content', async ()=> {
        await sut.initialize();
        const { statusCode, html } = await sut.getContent();

        expect(statusCode).toEqual(200);
        expect(html).toEqual('');
    });

    test('plugin execute middleWare ongenerateContact', async () => {
        const middleWare1 = jest.fn().mockImplementation(async (data) => {
            return data;
        });
        const plugin: Plugin = {
            initialize: async (context) => {
              context.addMiddleWare({
                  order: 30,
                  middleWare: middleWare1,
              });
            }
        };
        await sut.addPlugins([plugin]);
        await sut.initialize();
        await sut.getContent();

        expect(middleWare1).toHaveBeenCalled();
    });
});
