import { EnhancedStore } from "@reduxjs/toolkit";
import * as React from "react";
import { Dispatch } from "redux";
import { App } from "./app";
import {
  AboutPage,
  AuthorsPage,
  CatalogPage,
  ContactsPage,
  DetailsPage,
  LoginPage,
  NewsPage,
  NotFoundPage,
  ProfilePage,
  RegisterPage,
  SearchHistoryPage,
  SearchPage,
} from "./pages";
import { setup } from "./setup";
import { getStore } from "./store";
import { fetchAuthorsListData } from "./store/author-list-page.slice";
import { fetchCatalogData } from "./store/catalog-page.slice";
import { fetchStructureDetailsData } from "./store/details-page.slice";

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
  const { type }  = context;
  if (type === AppContextType.frontend) {
    setup();
  }
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
              title: "About Us",
              description: "About Crystal Structure Search",
          },
          {
              path: "/authors/:page?",
              component: AuthorsPage,
              title: "Crystallographers List",
              description: "Top Crystallographers by published Structures count (based on cod database)",
              loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchAuthorsListData(params)),
          },
          {
              path: "/catalog/:page?",
              component: CatalogPage,
              title: "Crystal Structures List",
              description: "Crystal Structures List",
              loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchCatalogData(params)),
          },
          {
            path: "/structure/:id",
            component: DetailsPage,
            title: "Crystal Structure",
            description: "Crystal Structure",
            loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchStructureDetailsData(params)),
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
              path: "/profile",
              component: ProfilePage,
              title: "Profile",
              description: "User Profile Page",
          },
          {
              path: "/login",
              component: LoginPage,
              title: "Login",
              description: "User Login - Crystal Structure Search",
          },
          {
              path: "/register",
              component: RegisterPage,
              title: "Register",
              description: "Register User - Crystal Structure Search",
          },
          {
              path: "/search-history",
              component: SearchHistoryPage,
              title: "Search History",
              description: "Search History - Crystal Structure Search",
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
