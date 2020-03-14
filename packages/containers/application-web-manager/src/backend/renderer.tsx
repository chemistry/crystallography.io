import * as fs from "fs";
import * as path from "path";

import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { renderRoutes } from "react-router-config";
import { getApplication } from "../common";

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

const platform = {
    name: "backend",
    version: "0.0.1",
};

const getComponentHTML = ({ url }: {
    url: string,
}) => {

  const { Routes } = getApplication({ platform });
  const App = () => renderRoutes(Routes);
  const context = {};

  return renderToString((
      <div>
        <StaticRouter location={url} context={context}>
          <App />
        </StaticRouter>
      </div>
  ));
};
