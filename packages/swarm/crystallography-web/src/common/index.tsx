import * as React from "react";
import { EnhancedStore } from "@reduxjs/toolkit";
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
  SearchByAuthorsPage,
  SearchByFormulaPage,
  SearchByNamePage,
  SearchByStructurePage,
  SearchByUnitCellPage,
  SearchHistoryPage,
  SearchPage,
  SearchResultsPage
} from "./pages";
import { setup } from "./setup";
import { getStore } from "./store";
import { fetchAuthorsListData } from "./store/author-list-page.slice";
import { fetchCatalogData } from "./store/catalog-page.slice";
import { fetchStructureDetailsData } from "./store/details-page.slice";
import { fetchSearchResultsData } from "./store/search-results.slice";
import { RouteConfig } from "react-router-config";
import { useLoadedData } from "./services";

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

const withLoadedData = (Component: (props: { route: RouteConfig }) => JSX.Element ) => {
    return (props: { route: RouteConfig }) => {
        useLoadedData(props.route);
        return <Component {...props} />
    }
}

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
                component: withLoadedData(SearchByStructurePage),
                title: "Crystal Structure Search",
                description: "Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod",
            },
            {
                path: "/search/author",
                component: withLoadedData(SearchByAuthorsPage),
                title: "Crystal Structure Search",
                description: "Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod",
            },
            {
                path: "/search/name",
                component: withLoadedData(SearchByNamePage),
                title: "Crystal Structure Search",
                description: "Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod",
            },
            {
                path: "/search/formula",
                component: withLoadedData(SearchByFormulaPage),
                title: "Crystal Structure Search",
                description: "Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod",
            },
            {
                path: "/search/unitcell",
                component: withLoadedData(SearchByUnitCellPage),
                title: "Crystal Structure Search",
                description: "Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod",
            },
            {
                path: '/results/:id/:page?',
                component: withLoadedData(SearchResultsPage),
                title: "Crystal Structure Search",
                description: "Crystal Structure Search Online: Search Results",
                loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchSearchResultsData(params)),
            },
            {
                path: "/about",
                component: withLoadedData(AboutPage),
                title: "About Us",
                description: "About Crystal Structure Search",
            },
            {
                path: "/authors/:page?",
                component: withLoadedData(AuthorsPage),
                title: "Crystallographers List",
                description: "Top Crystallographers by published Structures count (based on cod database)",
                loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchAuthorsListData(params)),
            },
            {
                path: "/catalog/:page?",
                component: withLoadedData(CatalogPage),
                title: "Crystal Structures List",
                description: "Crystal Structures List",
                loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchCatalogData(params)),
            },
            {
                path: "/structure/:id",
                component: withLoadedData(DetailsPage),
                title: "Crystal Structure",
                description: "Crystal Structure",
                loadData: (dispatch: Dispatch<any>, params: any) => dispatch(fetchStructureDetailsData(params)),
            },
            {
                path: "/contact",
                component: withLoadedData(ContactsPage),
                title: "Contact Us",
                description: "Crystal Structure Search: Contacts",
            },
            {
                path: "/news",
                component: withLoadedData(NewsPage),
                title: "News",
                description: "News of Crystal Structure Search",
            },
            {
                path: "/profile",
                component: withLoadedData(ProfilePage),
                title: "Profile",
                description: "User Profile Page",
            },
            {
                path: "/login",
                component: withLoadedData(LoginPage),
                title: "Login",
                description: "User Login - Crystal Structure Search",
            },
            {
                path: "/register",
                component: withLoadedData(RegisterPage),
                title: "Register",
                description: "Register User - Crystal Structure Search",
            },
            {
                path: "/search-history",
                component: withLoadedData(SearchHistoryPage),
                title: "Search History",
                description: "Search History - Crystal Structure Search",
            },
            {
                path: "*",
                component: withLoadedData(NotFoundPage),
                title: "Crystal Structure Search",
                description: "Search over Crystal Structures",
            },
        ],
    }];

  return Promise.resolve({ Routes, getStore });
};
