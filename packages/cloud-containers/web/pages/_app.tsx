import Head from 'next/head';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import './app.scss';
import React, { useState } from 'react';
import { CollapseIcon, LogoMobileIcon, NavBtnIcon } from '../icons';
import { AppMobileNavigation, AppNavigation } from '../layout';
import classNames from 'classnames';

const MainLayout = ({ Component, pageProps }: AppProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
        <div className="app">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
                <meta name="author" content="Volodymyr D. Vreshch" />
            </Head>
            <div>
              <main className={classNames({ "app": true, "is-open-navigation": isOpen })}>
                <aside className="app-mobile-navigation">
                  <div className="app-mobile-navigation-icon" onClick={() => setOpen(!isOpen)}><NavBtnIcon /></div>
                  <div className="app-mobile-navigation-logo"><LogoMobileIcon /></div>
                </aside>
                <aside className="app-navigation-menu">
                  <AppMobileNavigation onClick={() => setOpen(!isOpen)} />
                </aside>
                <aside className="app-navigation-menu-layout" onClick={() => setOpen(false)}></aside>
                <aside className="app-navigation">
                    <AppNavigation />
                </aside>
                <div className="app-collapse-button" onClick={() => setOpen(!isOpen)}>
                    <CollapseIcon />
                </div>
                <section className="app-layout">
                    <Component {...pageProps} />
                </section>
              </main>
            </div>
        </div>
    );
}
export default MainLayout;

