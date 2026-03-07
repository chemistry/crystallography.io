import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContextType, getApplication } from '../common';
import type { ApplicationContext } from '../common';
import { StoreProvider } from '../common/store';
import { App } from '../common/app';
import { registerSW } from './register-sw';

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

  const initialState = (window as any).__INITIAL_STATE__ || {};

  hydrateRoot(
    document.getElementById('root')!,
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

  registerSW();
})();
