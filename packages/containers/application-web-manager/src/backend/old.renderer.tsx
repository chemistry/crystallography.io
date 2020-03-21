import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

export const renderToHTML = ({ url, layout }: {
    url: string,
    layout: any,
  }) => {

    const { Layout, getIndexHTML } =  layout;
    let html = getIndexHTML();
    const componentHTML = getComponentHTML({ url, Layout });

    html = html.replace(
        '<div id="app"></div>',
        '<div id="app">' + componentHTML + "</div>",
    );

    return html;
};

const getComponentHTML = ({ url, Layout }: {
    url: string,
    Layout: any,
}) => {
 const context = {};

 return renderToString((
      <div>
        <StaticRouter location={url} context={context}>
          <Layout />
        </StaticRouter>
      </div>
  ));
};
