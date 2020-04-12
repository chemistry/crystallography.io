import * as bodyParser from "body-parser";
import * as timeout from "connect-timeout";
import * as express from "express";
import * as path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

export interface ExpresContext {
    log: (message: string) => void;
    PORT: number;
    htmlContent: string;
}

function App() {
    return (
      <h1>App</h1>
    );
}

function renderHTML(html: string, componentHTML: string): string {
    return html.replace('<div id="app"></div>', '<div id="app">' + componentHTML + "</div>");
}

export async function startApplication(context: ExpresContext) {
    const { htmlContent, log } = context;
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
    app.use((req, res) => {
        const ctx: any = {
            status: 200,
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
    });

    return { app };
}
