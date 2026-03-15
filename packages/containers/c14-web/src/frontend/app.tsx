import { hydrateRoot, createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContextType, getApplication } from '../common/index.js';
import type { ApplicationContext } from '../common/index.js';
import { StoreProvider } from '../common/store/index.js';
import { App } from '../common/app.js';

const appContext: ApplicationContext = {
  type: AppContextType.frontend,
};

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 1.0,
  });
}

(async () => {
  const { routes } = await getApplication(appContext);

  const win = window as unknown as { __INITIAL_STATE__?: Record<string, unknown> };
  const initialState = win.__INITIAL_STATE__ || {};

  const rootElement = document.getElementById('root')!;
  const app = (
    <StoreProvider initialState={initialState}>
      <BrowserRouter>
        <Routes>
          <Route element={<App routes={routes} />}>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.element />} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
})();
