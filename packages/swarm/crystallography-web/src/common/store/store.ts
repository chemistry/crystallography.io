import { combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";

import catalogPageReducer from "./catalog-page.slice";
import detailsPageReducer from "./details-page.slice";
import authorsListPageReducer from "./author-list-page.slice";
import searchByNameSliceReducer from "./search-by-name-page.slice";
import searchByAuthorSliceReducer from "./search-by-author-page.slice";
import userSlice from "./user.slice";

const reducer = combineReducers({
    catalogPage: catalogPageReducer,
    detailsPage: detailsPageReducer,
    authorsListPage: authorsListPageReducer,
    searchByNameSlice: searchByNameSliceReducer,
    searchByAuthorSlice: searchByAuthorSliceReducer,
    user: userSlice,
});

const isDevelopment = (process.env.NODE_ENV !== "production");
const isNode = (typeof module !== 'undefined' && module.exports);
const middleware = [
    ...getDefaultMiddleware(),
    ...((isDevelopment  && !isNode)? [logger] : []),
];
export type RootState = ReturnType<typeof reducer>;

export const getStore = (preloadedState: RootState | null) => {
    return configureStore({
      reducer,
      middleware,
      devTools: !isDevelopment,
      preloadedState: (preloadedState ? preloadedState : {}) as any,
    });
};
