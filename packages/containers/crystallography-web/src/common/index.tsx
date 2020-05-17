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
              title: "Crystal Structure Search",
              description: "Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod",
          },
          {
              path: "/about",
              component: AboutPage,
              title: "About",
              description: "About Crystal Structure Search",
          },
          {
              path: "/authors/:page?",
              component: AuthorsPage,
              title: "Crystallographers List",
              description: "Top Crystallographers by published Structures count (based on cod database)",
          },
          {
              path: "/catalog/:page?",
              component: CatalogPage,
              title: "Crystal Structures List",
              description: "Crystal Structures List",
              loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchStructures(params)),
          },
          {
              path: "/contact",
              component: ContactsPage,
              title: "Contact Us",
              description: "Crystal Structure Search: Contacts",
          },
          {
              path: "/news",
              component: NewsPage,
              title: "News",
              description: "News of Crystal Structure Search",
          },
          {
              path: "*",
              component: NotFoundPage,
              title: "Crystal Structure Search",
              description: "Search over Crystal Structures",
          },
      ],
  }];

  return Promise.resolve({ Routes, getStore });
};
