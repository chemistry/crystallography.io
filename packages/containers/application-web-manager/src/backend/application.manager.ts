import { Plugin } from "../interfaces";
export interface ApplicationManager {
    getPlugins({ url }: { url: string }): Promise<Plugin[]>;
}
export type ApplicationManagerFactory = () => ApplicationManager;

export const getApplicationManager: ApplicationManagerFactory = () => {
  const getPlugins = async () => {
      const plugins: Plugin[] = [];
      return plugins;
  };
  return {
      getPlugins,
  };
};
