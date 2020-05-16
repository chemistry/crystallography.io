import { EnhancedStore } from "@reduxjs/toolkit";
import * as React from "react";
import { Dispatch } from "redux";
import { App } from "./app";
import {
  AboutPage,
  AuthorsPage,
  CatalogPage,
  ContactsPage,
  MainPage,
  NewsPage,
  NotFoundPage,
  SearchPage,
} from "./pages";
import { getStore } from "./store";
import { fetchStructures } from "./store/structures.slice";

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
              component: SearchPage,
          },
          {
              path: "/about",
              component: AboutPage,
          },
          {
              path: "/authors/:page?",
              component: AuthorsPage,
          },
          {
              path: "/catalog/:page?",
              component: CatalogPage,
              loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchStructures(params)),
          },
          {
              path: "/contact",
              component: ContactsPage,
          },
          {
              path: "/news",
              component: NewsPage,
          },
          {
              path: "*",
              component: NotFoundPage,
          },
      ],
  }];

  return Promise.resolve({ Routes, getStore });
};
