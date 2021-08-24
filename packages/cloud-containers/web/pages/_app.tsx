const classNames = require("classnames");
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { CollapseIcon, LogoMobileIcon, NavBtnIcon } from "../icons";
import { AppMobileNavigation, AppNavigation  } from "../layout";

// Include Global Application Styles
import "./app.scss";
import '../styles/globals.css';

export default function MainLayout({ Component, pageProps }: AppProps) {
  const [isOpen, setOpen] = useState(false);

  return (
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
  );
  }
