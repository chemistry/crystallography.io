import * as bodyParser from "body-parser";
import * as timeout from "connect-timeout";
import * as express from "express";
import * as path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
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

function renderHTML(html: string, componentHTML: string): string {
    return html.replace('<div id="root"></div>', '<div id="root">' + componentHTML + "</div>");
}

export async function startApplication(context: ExpresContext) {
    const { htmlContent, log, appFactory, appContext } = context;
    log("application started");

    const app = express();

    // Add UTF-8 symbols parser
    app.set("query parser", "simple");

    app.use(timeout("5s"));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Remove header
    app.disable("x-powered-by");

    // Serve static files
    app.use(express.static(path.join(__dirname, "/../static"), {index: false}));

    // Rendering to StaticRouter
    app.use(async (req, res, next) => {
      try {
          const ctx: any = {
              status: 200,
          };
          const { Routes } = await appFactory(appContext);
          const App = () => {
              return renderRoutes(Routes);
          };

          const content = (
              <StaticRouter location={req.url} context={ctx}>
                  <App />
              </StaticRouter>
          );
          const componentHTML = renderToString(content);
          const HTML = renderHTML(htmlContent, componentHTML);
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
