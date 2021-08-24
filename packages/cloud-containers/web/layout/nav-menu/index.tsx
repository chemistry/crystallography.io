import Link from "next/link";
import { withRouter } from "next/router";
import * as React from "react";
import {
  MenuAuthorsIcon, MenuCatalogIcon, MenuInfoIcon, MenuNewsIcon, MenuSearchIcon, SignInIcon,
} from "../../icons";

const ActiveLink = withRouter( (({ router, children, ...props }: any) => {
  const child = React.Children.only(children);

  let className = child.props.className || '';
  if (router.pathname === props.href && props.activeClassName) {
    className = `${className} ${props.activeClassName}`.trim();
  }

  delete props.activeClassName;

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}));


export const NavMenuBottom = ({ onClick }: { onClick?: () => void }) => {
    return (<div className="nav-menu">
        <ul className="nav-menu-list">
          <li>
              <ActiveLink href="/login" activeClassName="active">
                <a className="nav-menu-item" onClick={onClick}>
                  <div className="nav-menu-item__icon"><SignInIcon /></div>
                  <div className="nav-menu-item__title">Login</div>
                </a>
              </ActiveLink>
          </li>
        </ul>
    </div>);
};

export const NavMenuTop = ({ onClick }: { onClick?: () => void }) => {
    return (
        <div className="nav-menu">
            <ul className="nav-menu-list">
            <li>
                <ActiveLink href="/" exact={true} activeClassName="active">
                  <a className="nav-menu-item" onClick={onClick}>
                    <div className="nav-menu-item__icon"><MenuSearchIcon /></div>
                    <div className="nav-menu-item__title">Search Structure</div>
                  </a>
                </ActiveLink>
            </li>
            {
                /*
                    <li>
                        <NavLink to="/search-history" className="nav-menu-item" activeClassName="active" onClick={onClick}>
                            <div className="nav-menu-item__icon"><SearchHistoryIcon /></div>
                            <div className="nav-menu-item__title">Search History</div>
                        </NavLink>
                    </li>
                */
            }
            <li>
                <ActiveLink href="/authors" className="nav-menu-item" activeClassName="active" onClick={onClick}>
                    <a className="nav-menu-item" onClick={onClick}>
                      <div className="nav-menu-item__icon"><MenuAuthorsIcon /></div>
                      <div className="nav-menu-item__title">Authors</div>
                    </a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink href="/catalog" activeClassName="active">
                    <a className="nav-menu-item" onClick={onClick}>
                      <div className="nav-menu-item__icon"><MenuCatalogIcon /></div>
                      <div className="nav-menu-item__title">Catalog</div>
                    </a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink href="/about" activeClassName="active">
                    <a className="nav-menu-item" onClick={onClick}>
                      <div className="nav-menu-item__icon"><MenuInfoIcon /></div>
                      <div className="nav-menu-item__title">About Us</div>
                    </a>
                </ActiveLink>
            </li>
            <li>
                <ActiveLink href="/news" activeClassName="active" >
                  <a className="nav-menu-item"  onClick={onClick}>
                    <div className="nav-menu-item__icon"><MenuNewsIcon /></div>
                    <div className="nav-menu-item__title">Updates</div>
                  </a>
                </ActiveLink>
            </li>
            </ul>
        </div>
    );
};
