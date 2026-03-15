import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import express from 'express';
import type { NextFunction, Request, Response, Express } from 'express';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { matchPath, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../common/store/index.js';
import { createAppStore } from '../common/store/create-app-store.js';
import { App } from '../common/app.js';
import type { ApplicationContext, ApplicationFactory, RouteDefinition } from '../common/index.js';
import type { AppStore } from '../common/store/create-app-store.js';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ExpressContext {
  logger: {
    trace: (message: string) => void;
    info: (message: string) => void;
    error: (message: string) => void;
  };
  PORT: number;
  htmlContent: string;
  onAppInit: (app: Express) => void;
  onAppInitEnd: (express: Express) => void;
  appContext: ApplicationContext;
  appFactory: ApplicationFactory;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHTML(
  fileContent: string,
  componentHTML: string,
  initialState: Record<string, unknown>,
  metaData: { title: string; description: string; url: string }
): string {
  let html = fileContent;
  const title = metaData?.title || 'Crystal Structure Search';
  const description =
    metaData?.description || 'Crystal Structure Search Online: Open Crystal Structure DataBase';
  const url = 'https://crystallography.io' + metaData.url;

  html = html.replace(
    '<title>Crystallography Online Website</title>',
    '<title>' + escapeHTML(title) + '</title>'
  );
  html = html.replace(
    'content="Crystal Structure Search Online: Open Crystal Structure DataBase"',
    'content="' + escapeHTML(description) + '"'
  );

  // OG tags
  html = html.replace(
    '<meta property="og:title" content="" />',
    '<meta property="og:title" content="' + escapeHTML(title) + '" />'
  );
  html = html.replace(
    '<meta property="og:description" content="" />',
    '<meta property="og:description" content="' + escapeHTML(description) + '" />'
  );
  html = html.replace(
    '<meta property="og:url" content="" />',
    '<meta property="og:url" content="' + escapeHTML(url) + '" />'
  );

  // Twitter tags
  html = html.replace(
    '<meta name="twitter:title" content="" />',
    '<meta name="twitter:title" content="' + escapeHTML(title) + '" />'
  );
  html = html.replace(
    '<meta name="twitter:description" content="" />',
    '<meta name="twitter:description" content="' + escapeHTML(description) + '" />'
  );

  html = html.replace('<div id="root"></div>', '<div id="root">' + componentHTML + '</div>');
  html = html.replace(
    'window.__INITIAL_STATE__={};',
    'window.__INITIAL_STATE__=' + JSON.stringify(initialState) + ';'
  );
  return html;
}

const loadSiteData = async (routes: RouteDefinition[], url: string, store: AppStore) => {
  const promises = routes
    .filter((route) => route.loadData && matchPath(route.path, url))
    .map((route) => {
      const match = matchPath(route.path, url);
      const preParams: Record<string, string> = (match?.params as Record<string, string>) || {};
      const params = Object.keys(preParams).reduce(
        (acc, key) => ({ ...acc, [key]: decodeURIComponent(preParams[key] || '') }),
        {} as Record<string, string>
      );
      return route.loadData!(store, params);
    });
  return Promise.all(promises);
};

const getMetadata = (routes: RouteDefinition[], url: string) => {
  const matched = routes.find((route) => matchPath(route.path, url));
  return {
    title: matched?.title || '',
    description: matched?.description || '',
    url,
  };
};

export async function startApplication(context: ExpressContext) {
  const { htmlContent, logger, appFactory, appContext, onAppInit, onAppInitEnd } = context;
  logger.trace('application started');

  const app = express();

  app.set('query parser', 'simple');
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(timeout('5s'));
  app.use(bodyParser.urlencoded({ extended: true }));

  onAppInit(app);

  app.use(express.static(path.join(__dirname, '/../static'), { index: false }));

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { routes } = await appFactory(appContext);
      const store = createAppStore();

      await loadSiteData(routes, req.url, store);
      const metaData = getMetadata(routes, req.url);

      const componentHTML = renderToString(
        <StoreProvider initialState={store.getState()}>
          <StaticRouter location={req.url}>
            <Routes>
              <Route element={<App routes={routes} />}>
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} element={<route.element />} />
                ))}
              </Route>
            </Routes>
          </StaticRouter>
        </StoreProvider>
      );

      const initialState = store.getState() as unknown as Record<string, unknown>;
      const HTML = renderHTML(htmlContent, componentHTML, initialState, metaData);
      res.header('Content-Type', 'text/html; charset=utf-8').status(200).end(HTML);
    } catch (error) {
      Sentry.captureException(error);
      logger.error(String(error));
      next(error);
    }
  });

  onAppInitEnd(app);

  return { app };
}
