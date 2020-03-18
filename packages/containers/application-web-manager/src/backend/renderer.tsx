import * as fs from "fs";
import * as path from "path";

import { getApplication } from "@chemistry/application-cod-search";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { getLayout } from "../layout";
import { getPlatformAPI } from "./platform-api";

const platformAPI = getPlatformAPI();

const fileContent = fs.readFileSync(
    path.join(__dirname, "/../static/index.html"),
    "utf8",
);
export const renderToHTML = ({ url }: {
    url: string,
  }) => {
    let html = fileContent;
    const componentHTML = getComponentHTML({ url });

    html = html.replace(
        '<div id="app"></div>',
        '<div id="app">' + componentHTML + "</div>",
    );

    return html;
};

const getComponentHTML = ({ url }: {
    url: string,
}) => {
 const application = getApplication({ platformAPI });

 const { Layout } = getLayout({ platformAPI, application });
 const context = {};

 return renderToString((
      <div>
        <StaticRouter location={url} context={context}>
          <Layout />
        </StaticRouter>
      </div>
  ));
};
