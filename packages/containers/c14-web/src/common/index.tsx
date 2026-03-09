import * as Sentry from '@sentry/react';
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
  SearchResultsPage,
  OfflinePage,
} from './pages/index.js';
import { setup } from './setup.js';
import { useLoadedData } from './services/index.js';
import { AuthorDetailsPage } from './pages/author-details.js';
import type { AppStore } from './store/create-app-store.js';

export enum AppContextType {
  frontend = 'frontend',
  backend = 'backend',
}

export interface ApplicationContext {
  type: AppContextType;
}

export interface RouteDefinition {
  path: string;
  element: React.ComponentType;
  title: string;
  description: string;
  loadData?: (store: AppStore, params: Record<string, string>) => Promise<void>;
}

export interface Application {
  routes: RouteDefinition[];
}

export type ApplicationFactory = (context: ApplicationContext) => Promise<Application>;

const withLoadedData = (Component: React.ComponentType, route: RouteDefinition) => {
  const Wrapped = () => {
    useLoadedData(route);
    return <Component />;
  };
  Wrapped.displayName = `WithLoadedData(${Component.displayName || Component.name})`;
  return Wrapped;
};

const withSentryProfiler = (Component: React.ComponentType) => {
  if (process.env.BROWSER) {
    return Sentry.withProfiler(Component);
  }
  return Component;
};

export const getApplication: ApplicationFactory = async (context) => {
  const { type } = context;
  if (type === AppContextType.frontend) {
    setup();
  }

  const routeDefs: RouteDefinition[] = [
    {
      path: '/',
      element: SearchByStructurePage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod',
    },
    {
      path: '/offline',
      element: OfflinePage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod',
    },
    {
      path: '/search/author',
      element: SearchByAuthorsPage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod',
    },
    {
      path: '/search/name',
      element: SearchByNamePage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod',
    },
    {
      path: '/search/formula',
      element: SearchByFormulaPage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod',
    },
    {
      path: '/search/unitcell',
      element: SearchByUnitCellPage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Open Crystal Structure DataBase; WebCod',
    },
    {
      path: '/results/:id/:page?',
      element: SearchResultsPage,
      title: 'Crystal Structure Search',
      description: 'Crystal Structure Search Online: Search Results',
      loadData: async (store: AppStore, params: Record<string, string>) =>
        store.getState().fetchSearchResultsData(params as { id: string; page: string }),
    },
    {
      path: '/about',
      element: AboutPage,
      title: 'About Us',
      description: 'About Crystal Structure Search',
    },
    {
      path: '/authors/:page?',
      element: AuthorsPage,
      title: 'Crystallographers List',
      description: 'Top Crystallographers by published Structures count (based on cod database)',
      loadData: async (store: AppStore, params: Record<string, string>) =>
        store.getState().fetchAuthorsListData(params as { page: string }),
    },
    {
      path: '/author/:name/:page?',
      element: AuthorDetailsPage,
      title: 'Structures published',
      description: 'Crystal Structures published',
      loadData: async (store: AppStore, params: Record<string, string>) =>
        store.getState().fetchAuthorDetailsData(params as { page: string; name: string }),
    },
    {
      path: '/catalog/:page?',
      element: CatalogPage,
      title: 'Crystal Structures List',
      description: 'Crystal Structures List',
      loadData: async (store: AppStore, params: Record<string, string>) =>
        store.getState().fetchCatalogData(params as { page: string }),
    },
    {
      path: '/structure/:id',
      element: DetailsPage,
      title: 'Crystal Structure',
      description: 'Crystal Structure',
      loadData: async (store: AppStore, params: Record<string, string>) =>
        store.getState().fetchStructureDetailsData(params as { id: string }),
    },
    {
      path: '/contact',
      element: ContactsPage,
      title: 'Contact Us',
      description: 'Crystal Structure Search: Contacts',
    },
    {
      path: '/news',
      element: NewsPage,
      title: 'News',
      description: 'News of Crystal Structure Search',
    },
    {
      path: '/profile',
      element: ProfilePage,
      title: 'Profile',
      description: 'User Profile Page',
    },
    {
      path: '/login',
      element: LoginPage,
      title: 'Login',
      description: 'User Login - Crystal Structure Search',
    },
    {
      path: '/register',
      element: RegisterPage,
      title: 'Register',
      description: 'Register User - Crystal Structure Search',
    },
    {
      path: '/search-history',
      element: SearchHistoryPage,
      title: 'Search History',
      description: 'Search History - Crystal Structure Search',
    },
    {
      path: '*',
      element: NotFoundPage,
      title: 'Crystal Structure Search',
      description: 'Search over Crystal Structures',
    },
  ];

  const routes = routeDefs.map((route) => ({
    ...route,
    element: withSentryProfiler(withLoadedData(route.element, route)),
  }));

  return { routes };
};
