import * as React from "react";
import { renderRoutes } from "react-router-config";
import { getApplication } from "../common";
import { AppPlatformAPI } from "../interfaces";

// Shared Layout Across Different Platforms
export const getLayout = ({ platform }: { platform: AppPlatformAPI }) => {
    const { Routes } = getApplication({ platform });
    const Layout = () => (
      <div id="layout">{
        renderRoutes(Routes)
      }</div>
    );
    return {
        Layout,
    };
};
