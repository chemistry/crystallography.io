import * as React from "react";
import * as ReactDOM from "react-dom";
import { MiddleWare, MiddleWareParams, PlatfomContext, PlatformType, Plugin } from "../../interfaces";

export const frontendHTMLPlugin: Plugin = {
    async initialize(context: PlatfomContext) {
        if (
            context.type !== PlatformType.desktop &&
            context.type !== PlatformType.frontend
        ) {
            throw new Error("only frontend platform is supported");
        }
        // For local development - webpack dev server does not add coresponding div
        if (document.getElementById("app") === null) {
            document.open("text/html", "replace");
            document.write('<div id="app"></div>');
            document.close();
        }

        const middleWare: MiddleWare = async (data: MiddleWareParams) => {
              const Layout = data.layout ? data.layout : () => (<div></div>);

              ReactDOM.render(
                  <Layout />,
                  document.getElementById("app"),
              );
              return data;
        };
        context.addMiddleWare({
            order: 30,
            middleWare,
        });
    },
};
