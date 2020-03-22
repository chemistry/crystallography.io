import * as React from "react";
import { PlatfomContext, Plugin } from "../interfaces";

const layout = () => (
    <div id="layout"><h1>Content</h1></div>
);

export const layoutPlugin: Plugin = {
    async initialize(context: PlatfomContext) {
      const middleWare: any = async (data: any) => {
          return {
              ...data,
              layout,
          };
      };
      context.addMiddleWare({
          order: 20,
          middleWare,
      });
    },
};
