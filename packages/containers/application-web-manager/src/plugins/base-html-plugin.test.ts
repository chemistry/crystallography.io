import { Platform } from "../interfaces";
import { getPlatfom } from '../backend/paltform.backend';
import { baseHTMLPlugin } from './base-html-plugin';

describe("Backend Platform", ()=> {
    let platrofm: Platform;
    beforeEach(()=> {
        platrofm = getPlatfom();
    });

    test('should return html document', async ()=> {
        await platrofm.addPlugins([baseHTMLPlugin]);
        await platrofm.initialize();
        const { statusCode, html } = await platrofm.getContent();

        expect(html.length).toBeGreaterThan(100);
        expect(statusCode).toEqual(200);
    });
});
