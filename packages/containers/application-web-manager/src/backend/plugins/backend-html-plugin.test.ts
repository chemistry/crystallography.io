import { Platform } from "../../interfaces";
import { getPlatfom } from '../platform.backend';
import { backendHTMLPlugin } from './backend-html-plugin';

describe("Backend HTML Plugin", () => {
    let platrofm: Platform;
    beforeEach(()=> {
        platrofm = getPlatfom();
    });

    test('should return html document', async ()=> {
        await platrofm.addPlugins([backendHTMLPlugin]);
        await platrofm.initialize();
        const { statusCode, html } = await platrofm.getContent();

        expect(html.length).toBeGreaterThan(100);
        expect(statusCode).toEqual(200);
    });
});
