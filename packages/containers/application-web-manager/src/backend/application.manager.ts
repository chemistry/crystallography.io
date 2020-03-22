import { Plugin } from "../interfaces";
import {
  layoutPlugin,
} from "../shared";
import {
  backendHTMLPlugin,
} from "./plugins";

export interface ApplicationManager {
    getPlugins({ url }: { url: string }): Promise<Plugin[]>;
}
export type ApplicationManagerFactory = () => ApplicationManager;

export const getApplicationManager: ApplicationManagerFactory = () => {
  const getPlugins = async () => {
      const plugins: Plugin[] = [
          backendHTMLPlugin,
          layoutPlugin,
      ];
      return plugins;
  };
  return {
      getPlugins,
  };
};
