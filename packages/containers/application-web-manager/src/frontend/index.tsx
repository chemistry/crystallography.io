import { Plugin } from "../interfaces";
import { layoutPlugin } from "../shared";
import { getPlatfom } from "./platform.frontend";
import { frontendHTMLPlugin } from "./plugins";

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
