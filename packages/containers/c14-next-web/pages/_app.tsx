import React, { Children } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { withRouter } from 'next/router';
import type { AppProps } from 'next/app';
import classNames from 'classnames';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'


const ActiveLink = withRouter( (({ router, children, ...props }: any) => {
    const child = Children.only(children);

    let className = child.props.className || '';
    if (router.pathname === props.href && props.activeClassName) {
      className = `${className} ${props.activeClassName}`.trim();
    }

    delete props.activeClassName;

    return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}));


const Sidebar = ()=> {

    const sidebarClass = classNames({
        "jcw-sidebar": true,
        "closed": true,
    });

    return (
        <div className={sidebarClass}>
            <div>
                <ActiveLink exact={true} href="/" activeClassName="active"><a className="jcw-sidebar-item">Home</a></ActiveLink><br/>
                <ActiveLink href="/news" activeClassName="active"><a className="jcw-sidebar-item">News</a></ActiveLink><br/>
                <ActiveLink href="/about" activeClassName="active"><a className="jcw-sidebar-item">About</a></ActiveLink>
            </div>
        </div>
    )
}

export default function MainLayout({ Component, pageProps }: AppProps) {

    return (
        <div className="app">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
            </Head>
            <div className="app-container container">
                <div className="app-wrap row">
                    <div className="app-sidebar col-sm-12 col-md-3">
                        <Sidebar />
                    </div>
                    <div className="app-content col-sm-12 col-md-9"><Component {...pageProps} /></div>
                </div>
                <footer>
                    <hr />© Vreshch V.D. {(new Date()).getFullYear()}
                </footer>
            </div>
        </div>
    );
}
