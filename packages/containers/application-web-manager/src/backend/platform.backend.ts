import {
  MiddleWareParams, PlatformFactory, PlatformType, Plugin,
} from "../interfaces";

export const getPlatfom: PlatformFactory = () => {
    const context: {
        plugins: Plugin[],
        initialized: boolean,
        middleWares: any[];
    } = {
        plugins: [],
        initialized: false,
        middleWares: [],
    };
    const publicContext: any = {
        name: "backend-platform",
        type: PlatformType.backend,
        version: "0.0.1",
        addMiddleWare: (middleWareParams: any) => {
            context.middleWares.push(middleWareParams);
        },
    };

    const addPlugins = async (plg: Plugin[]) => {
        const { initialized, plugins } = context;
        if (initialized) {
            return  Promise.reject();
        }
        plugins.push(...plg);
    };

    const initialize = async () => {
        const { plugins } = context;
        for (const plugin of plugins) {
            await plugin.initialize(publicContext);
        }
        context.initialized = true;
    };

    const getContent = async () => {
        const { middleWares } = context;
        const initialData: MiddleWareParams = {
            statusCode: 200,
            html: "",
            layout: null,
            views: { },
        };

        middleWares.sort((a, b) => {
            return a.order - b.order;
        });

        return middleWares
          .map(({ order, middleWare}) => middleWare)
          .reduce((acc, res) => {
              return acc.then(res);
          }, Promise.resolve(initialData));
    };
    return {
      addPlugins,
      initialize,
      getContent,
    };
};
