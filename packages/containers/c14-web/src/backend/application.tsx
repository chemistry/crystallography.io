import * as bodyParser from "body-parser";
import timeout from "connect-timeout";
import * as Sentry from "@sentry/node";
import express, { NextFunction, Request, Response, Express } from "express";
import escapeHTML from "lodash.escape";
import * as path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { matchRoutes, renderRoutes } from "react-router-config";
import { ApplicationContext, ApplicationFactory } from "../common";
import { getAuthRouter } from "./auth.router";

export interface ExpressContext {
    logger: {
        trace:(message: string) => void;
        info: (message: string) => void;
        error: (message: string) => void;
    },
    PORT: number;
    htmlContent: string;
    onAppInit: (app: Express) => void;
    onAppInitEnd: (express: Express) => void;
    appContext: ApplicationContext;
    appFactory: ApplicationFactory;
}

function renderHTML(
    fileContent: string, componentHTML: string, initialState: any, metaData: { title: string, description: string },
): string {
    let html = fileContent;
    if (metaData && metaData.title) {
        html = html.replace("<title>Crystallography Online Website</title>", "<title>" + escapeHTML(metaData.title) + "</title>");
    }
    if (metaData && metaData.description) {
        html = html.replace(
          '<meta name="description" content="" />',
          '<meta name="description" content="' + escapeHTML(metaData.description) + '" />',
        );
    }

    html = html.replace('<div id="root"></div>', '<div id="root">' + componentHTML + "</div>");
    html = html.replace("window.__INITIAL_STATE__={};", "window.__INITIAL_STATE__=" + JSON.stringify(initialState) + ";");
    return html;
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

const getMetadata = (routes: any, url: string) => {
  const branches = matchRoutes(routes, url);

  const titleRes = branches
    .map(({ route: { title } }) => title)
    .filter((title) => !!title)
    .join(",");

  const descriptionRes = branches
      .map(({ route: { description } }) => description)
      .filter((description) => !!description)
      .join(",");
  return {
      title: titleRes,
      description: descriptionRes,
  };
};

export const startApplication: any = async (context: ExpressContext) => {
    const { htmlContent, logger, appFactory, appContext, onAppInit, onAppInitEnd } = context;
    logger.trace('application started');

    const app = express();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(timeout("5s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Add Logs to application
    onAppInit(app);

    // Serve static files
    app.use(express.static(path.join(__dirname, "/../static"), {index: false}));

    app.use(getAuthRouter());

    // Rendering to StaticRouter
    app.use(async (req: Request, res: Response, next: NextFunction) => {

        try {
            const ctx: any = {
                status: 200,
            };
            const { Routes, getStore } = await appFactory(appContext);
            const store = getStore(null);

            await loadSiteData(Routes, req.url, store.dispatch);
            const metaData = getMetadata(Routes, req.url);

            const App = () => {
                return renderRoutes(Routes);
            };
            const ProviderAny: any = Provider;

            const content = (
                <ProviderAny store={store}>
                    <StaticRouter location={req.url} context={ctx}>
                        <App />
                    </StaticRouter>
                </ProviderAny>
            );

            const componentHTML = renderToString(content);
            const initialState = store.getState();
            const HTML = renderHTML(htmlContent, componentHTML, initialState, metaData);
            res
                .header("Content-Type", "text/html; charset=utf-8")
                .status(ctx.status)
                .end(HTML);

        } catch (error) {
            Sentry.captureException(error);
            logger.error(String(error));
            next(error);
        }
    });

    onAppInitEnd(app);

    return { app };
}
