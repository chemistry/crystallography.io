import { EnhancedStore } from "@reduxjs/toolkit";
import * as React from "react";
import { App } from "./app";
import { AboutPage, MainPage, NewsPage, NotFoundPage } from "./pages";
import { getStore } from "./store";

export enum AppContextType {
    frontend = "frontend",
    backend = "backend",
}
export interface ApplicationContext {
    type: AppContextType;
}
export interface Application {
    Routes: any;
    getStore: (initialState: any) => EnhancedStore;
}
export type ApplicationFactory = (context: ApplicationContext) =>  Promise<Application>;

export const getApplication: ApplicationFactory = async (context: ApplicationContext) => {

  const Routes = [{
      component: App,
      routes: [
          {
              path: "/",
              exact: true,
              component: MainPage,
          },
          {
              path: "/news",
              component: NewsPage,
          },
          {
              path: "/about",
              component: AboutPage,
          },
          {
              path: "*",
              component: NotFoundPage,
          },
      ],
  }];

  return Promise.resolve({ Routes, getStore });
};
