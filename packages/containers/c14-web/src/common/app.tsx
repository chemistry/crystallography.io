import { useEffect, useState } from 'react';
import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { cn } from './utils/cn';
import { CollapseIcon, LogoMobileIcon, NavBtnIcon } from './icons';
import { AppMobileNavigation, AppNavigation } from './layout';
import type { RouteDefinition } from './index';

if (process.env.BROWSER) {
  import('./styles/tailwind.css');
}

export const App = ({ routes }: { routes: RouteDefinition[] }) => {
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  const matchedRoute = routes.find((r) => matchPath(r.path, location.pathname));
  const title = matchedRoute?.title || 'Crystal Structure Search';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main className={cn('app', isOpen && 'is-open-navigation')}>
      <aside className="app-mobile-navigation">
        <div className="app-mobile-navigation-icon" onClick={() => { setOpen(!isOpen); }}>
          <NavBtnIcon />
        </div>
        <div className="app-mobile-navigation-logo">
          <LogoMobileIcon />
        </div>
      </aside>
      <aside className="app-navigation-menu">
        <AppMobileNavigation onClick={() => { setOpen(!isOpen); }} />
      </aside>
      <aside className="app-navigation-menu-layout" onClick={() => { setOpen(false); }}></aside>
      <aside className="app-navigation">
        <AppNavigation />
      </aside>
      <div className="app-collapse-button" onClick={() => { setOpen(!isOpen); }}>
        <CollapseIcon />
      </div>
      <section className="app-layout">
        <Outlet />
      </section>
    </main>
  );
};
