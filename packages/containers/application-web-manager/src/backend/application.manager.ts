import { Plugin } from "../interfaces";
import {
    baseHTMLPlugin,
} from "../plugins";

export interface ApplicationManager {
    getPlugins({ url }: { url: string }): Promise<Plugin[]>;
}
export type ApplicationManagerFactory = () => ApplicationManager;

export const getApplicationManager: ApplicationManagerFactory = () => {
  const getPlugins = async () => {
      const plugins: Plugin[] = [
          baseHTMLPlugin,
      ];
      return plugins;
  };
  return {
      getPlugins,
  };
};
