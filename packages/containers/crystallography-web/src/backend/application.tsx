import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import express from "express";
import * as path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { matchRoutes, renderRoutes } from "react-router-config";
import { ApplicationContext, ApplicationFactory } from "../common";

export interface ExpresContext {
    log: (message: string) => void;
    PORT: number;
    htmlContent: string;
    appContext: ApplicationContext;
    appFactory: ApplicationFactory;
}

function renderHTML(html: string, componentHTML: string, initialState: any): string {
    let res = html.replace('<div id="root"></div>', '<div id="root">' + componentHTML + "</div>");
    res = res.replace("window.__INITIAL_STATE__={};", "window.__INITIAL_STATE__=" + JSON.stringify(initialState) + ";");
    return res;
}

const loadSiteData = (routes: any, url: string, dispatch: any) => {
  const branch = matchRoutes(routes, url);

  const promises = branch.map(({ route, match }) => {
    if (!route.loadData) {
        return Promise.resolve();
    }
    const preParams: any = match.params || {};
    const params = Object.keys(preParams).reduce((acc, key) => {
        return { ...acc, [key]: decodeURIComponent(preParams[key] || "") };
    }, {});
    return route.loadData(dispatch, params);
  });
  return Promise.all(promises);
};

export async function startApplication(context: ExpresContext) {
    const { htmlContent, log, appFactory, appContext } = context;
    log("application started");

    const app: any = express();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(timeout("5s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Serve static files
    app.use(express.static(path.join(__dirname, "/../static"), {index: false}));

    // Rendering to StaticRouter
    app.use(async (req: any, res: any, next: any) => {

      try {
          const ctx: any = {
              status: 200,
          };
          const { Routes, getStore } = await appFactory(appContext);
          const store = getStore(null);

          await loadSiteData(Routes, req.url, store.dispatch);

          const App = () => {
              return renderRoutes(Routes);
          };

          const content = (
              <Provider store={store}>
                  <StaticRouter location={req.url} context={ctx}>
                      <App />
                  </StaticRouter>
              </Provider>
          );

          const componentHTML = renderToString(content);
          const initialState = store.getState();
          const HTML = renderHTML(htmlContent, componentHTML, initialState);
          res
            .header("Content-Type", "text/html; charset=utf-8")
            .status(ctx.status)
            .end(HTML);

      } catch (error) {
          next(error);
      }
    });

    return { app };
}
