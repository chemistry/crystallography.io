import { combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";

import catalogPageReducer from "./catalog-page.slice";
import userSlice from "./user.slice";

const reducer = combineReducers({
  catalogPage: catalogPageReducer,
  user: userSlice,
});

const isDevelopment = (process.env.NODE_ENV !== "production");
const middleware = [
    ...getDefaultMiddleware(),
    ...(isDevelopment ? [logger] : []),
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
