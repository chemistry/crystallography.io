import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function MainLayout({ Component, pageProps }: AppProps) {
  return (
        <div className="app">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
                <meta name="author" content="Volodymyr D. Vreshch" />
            </Head>
            <div>
              <Component {...pageProps} />
            </div>
        </div>
    );
}
