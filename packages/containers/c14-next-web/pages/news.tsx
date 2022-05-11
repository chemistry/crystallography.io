import Head from 'next/head';
import React from 'react';

export default function NewsPage() {
    return (
        <div>
            <Head>
                <title> News</title>
            </Head>
            <h1>News</h1>
            <hr />
            <div className="app-text">
                <p>News</p>
            </div>
        </div>
    );
};
