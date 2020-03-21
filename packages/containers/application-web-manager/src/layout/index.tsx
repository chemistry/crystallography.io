import { Application, AppPlatformAPI } from "@chemistry/application-common";
import * as React from "react";
import { renderRoutes } from "react-router-config";

// Factory method for generating index.html based on metadata
// Executed on backend, on index.js request and localy during hmr
export const getIndexHTML = () => {
    return (
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <meta name="description" content="" />
    <title>Chemical Applications</title>
</head>
<body>
    <div id="app"></div>
    <script type="text/javascript" src="/index.js"></script>
</body>
</html>`);
};

// Shared Layout Across Different Applications
export const getLayout = ({ platformAPI, application }: {
    platformAPI: AppPlatformAPI, application: Application,
}) => {
    const { Routes } = application;

    const Layout = () => (
      <div id="layout">
        {renderRoutes(Routes)}
      </div>
    );
    const initialize = () => {
        return Promise.resolve();
    };
    return {
        initialize,
        Layout,
        getIndexHTML,
    };
};
