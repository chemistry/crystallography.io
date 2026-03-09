import { NavLink } from 'react-router-dom';
import { LogoIcon, TitleIcon } from '../../icons/index.js';
import { NavMenuTop } from '../nav-menu/index.js';

export const AppNavigation = () => {
  return (
    <>
      <header className="app-navigation-header">
        <NavLink to="/" end className="app-navigation-header-logo">
          <div className="app-navigation-header__logo-icon">
            <LogoIcon />
          </div>
          <div className="app-navigation-header__logo-title">
            <TitleIcon />
          </div>
        </NavLink>
        <div className="app-navigation-header-menu-top">
          <NavMenuTop />
        </div>
      </header>
    </>
  );
};
