import { combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";

import structuresSlice from "./structures.slice";

const reducer = combineReducers({
  structures: structuresSlice,
});
const middleware = [
    ...getDefaultMiddleware(),
    ...(process.env.BROWSER ? [logger] : []),
];
export type RootState = ReturnType<typeof reducer>;

export const getStore = (preloadedState: RootState | null) => {
    return configureStore({
      reducer,
      middleware,
      devTools: process.env.NODE_ENV !== "production",
      preloadedState: preloadedState ? preloadedState : {},
    });
};
