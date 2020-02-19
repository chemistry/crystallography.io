import * as fs from "fs";
import * as path from "path";

import * as React from "react";
import { renderToString } from "react-dom/server";
import { App } from "../common";

const fileContent = fs.readFileSync(
  path.join(__dirname, "/../static/index.html"),
"utf8");

export const renderToHTML = ({ url }: {
    url: string,
  }) => {
    let html = fileContent;
    const componentHTML = getComponentHTML();

    html = html.replace(
        '<div id="app"></div>',
        '<div id="app">' + componentHTML + "</div>",
    );

    return html;
};
export const getComponentHTML = () => renderToString((
    <div><App /></div>
));
