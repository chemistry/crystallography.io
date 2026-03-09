import { NavLink } from 'react-router-dom';
import {
  MenuAuthorsIcon,
  MenuCatalogIcon,
  MenuInfoIcon,
  MenuNewsIcon,
  MenuSearchIcon,
  SignInIcon,
} from '../../icons/index.js';

export const NavMenuBottom = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="nav-menu">
      <ul className="nav-menu-list">
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => `nav-menu-item${isActive ? ' active' : ''}`}
            onClick={onClick}
          >
            <div className="nav-menu-item__icon">
              <SignInIcon />
            </div>
            <div className="nav-menu-item__title">Login</div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export const NavMenuTop = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="nav-menu">
      <ul className="nav-menu-list">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-menu-item${isActive ? ' active' : ''}`}
            onClick={onClick}
          >
            <div className="nav-menu-item__icon">
              <MenuSearchIcon />
            </div>
            <div className="nav-menu-item__title">Search Structure</div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/authors"
            className={({ isActive }) => `nav-menu-item${isActive ? ' active' : ''}`}
            onClick={onClick}
          >
            <div className="nav-menu-item__icon">
              <MenuAuthorsIcon />
            </div>
            <div className="nav-menu-item__title">Authors</div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/catalog"
            className={({ isActive }) => `nav-menu-item${isActive ? ' active' : ''}`}
            onClick={onClick}
          >
            <div className="nav-menu-item__icon">
              <MenuCatalogIcon />
            </div>
            <div className="nav-menu-item__title">Catalog</div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-menu-item${isActive ? ' active' : ''}`}
            onClick={onClick}
          >
            <div className="nav-menu-item__icon">
              <MenuInfoIcon />
            </div>
            <div className="nav-menu-item__title">About Us</div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/news"
            className={({ isActive }) => `nav-menu-item${isActive ? ' active' : ''}`}
            onClick={onClick}
          >
            <div className="nav-menu-item__icon">
              <MenuNewsIcon />
            </div>
            <div className="nav-menu-item__title">Updates</div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
