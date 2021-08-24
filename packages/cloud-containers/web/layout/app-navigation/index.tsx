import * as React from "react";
import { withRouter } from 'next/router';
import Link from 'next/link';
import { LogoIcon, TitleIcon } from "../../icons";
import { NavMenuBottom, NavMenuTop } from "../nav-menu";

const ActiveLink = withRouter( (({ router, children, ...props }: any) => {
  const child = React.Children.only(children);

  let className = child.props.className || '';
  if (router.pathname === props.href && props.activeClassName) {
    className = `${className} ${props.activeClassName}`.trim();
  }

  delete props.activeClassName;

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}));


export const AppNavigation = () => {
   return (
     <>
       <header className="app-navigation-header">
          <ActiveLink href="/" exact={true}>
              <a className="app-navigation-header-logo">
                <div className="app-navigation-header__logo-icon">
                  <LogoIcon />
                </div>
                <div className="app-navigation-header__logo-title">
                  <TitleIcon />
                </div>
              </a>
          </ActiveLink>
          <div className="app-navigation-header-menu-top">
              <NavMenuTop />
          </div>
          {
              /*
                <div className="app-navigation-header-menu-bottom">
                    <NavMenuBottom />
                </div>
            */
          }
       </header>
      </>
    );
};
