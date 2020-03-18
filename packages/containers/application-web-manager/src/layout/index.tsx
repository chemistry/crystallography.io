import { Application, AppPlatformAPI } from "@chemistry/application-common";
import * as React from "react";
import { renderRoutes } from "react-router-config";

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
    return {
        Layout,
    };
};
