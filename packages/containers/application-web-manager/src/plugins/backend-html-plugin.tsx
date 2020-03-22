import * as React from "react";
import { renderToString } from "react-dom/server";
import { MiddleWare, MiddleWareParams, PlatfomContext, PlatformType, Plugin } from "../interfaces";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <meta name="description" content="" />
    <title>Chemical Applications</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

export const backendHTMLPlugin: Plugin = {
    async initialize(context: PlatfomContext) {
        if (context.type !== PlatformType.backend) {
            throw new Error("plugin could be used with BE only");
        }

        const middleWare: MiddleWare = async (data: MiddleWareParams) => {
              const Layout = data.layout ? data.layout : () => (<div></div>);

              const componentHTML = renderToString(
                  <Layout />,
              );
              const newHTML = html.replace(
                  '<div id="app"></div>',
                  '<div id="app">' + componentHTML + "</div>",
              );

              return {
              ...data,
              html: newHTML,
            };
        };
        context.addMiddleWare({
            order: 30,
            middleWare,
        });
    },
};
