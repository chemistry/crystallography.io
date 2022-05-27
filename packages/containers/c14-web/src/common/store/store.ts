import { combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { wsMiddleware } from './store.wsMiddleware';

import catalogPageReducer from "./catalog-page.slice";
import detailsPageReducer from "./details-page.slice";
import authorsListPageReducer from "./author-list-page.slice";
import searchByNameSliceReducer from "./search-by-name-page.slice";
import searchByAuthorSliceReducer from "./search-by-author-page.slice";
import searchByFormulaSliceReducer from "./search-by-formula-page.slice";
import searchByUnitCellReducer from "./search-by-unit-cell-page.slice";
import searchByStructureReducer from "./search-by-structure.slice";
import searchResultsReducer from "./search-results.slice";
import authorsDetailsPageReducer from "./author-details-page.slice";

import userSlice from "./user.slice";

const reducer = combineReducers({
    catalogPage: catalogPageReducer,
    searchByUnitCellSlice: searchByUnitCellReducer,
    detailsPage: detailsPageReducer,
    authorsListPage: authorsListPageReducer,
    searchByNameSlice: searchByNameSliceReducer,
    searchByAuthorSlice: searchByAuthorSliceReducer,
    searchByFormulaSlice: searchByFormulaSliceReducer,
    searchByStructure: searchByStructureReducer,
    searchResults: searchResultsReducer,
    authorsDetailsPage: authorsDetailsPageReducer,
    user: userSlice,
});

const isDevelopment = (process.env.NODE_ENV !== "production");
const isNode = (!process.env.BROWSER);
const middleware = [
    ...getDefaultMiddleware(),
    ...((isDevelopment  && !isNode)? [logger] : []),
    ...(isNode ? []: [wsMiddleware])
];
export type RootState = ReturnType<typeof reducer>;

export const getStore = (preloadedState: RootState | null) => {
    return configureStore({
      reducer,
      middleware,
      devTools: isDevelopment,
      preloadedState: (preloadedState ? preloadedState : {}),
    });
};
