import { PlatfomContext, Plugin } from "../interfaces";

export const baseHTMLPlugin: Plugin = {
    async initialize(context: PlatfomContext) {
        const middleWare: any = (data: any) => (next: any) => {
            return next({
              ...data,
              html: "SOME HTML CONTENT",
            });
        };
        context.addMiddleWare({
            order: 30,
            middleWare,
        });
    },
};
