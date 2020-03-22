import { Plugin } from "../interfaces";
import { frontendHTMLPlugin, layoutPlugin } from "../plugins";
import { getPlatfom } from "./platform.frontend";

(async () => {
    const plugins: Plugin[] = [
        frontendHTMLPlugin,
        layoutPlugin,
    ];
    const platform = getPlatfom();
    await platform.addPlugins(plugins);
    await platform.initialize();
    await platform.getContent();
})();
