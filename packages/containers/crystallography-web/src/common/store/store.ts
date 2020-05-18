import { combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import logger from "redux-logger";

import structuresSlice from "./structures.slice";
import userSlice from "./user.slice";

const reducer = combineReducers({
  structures: structuresSlice,
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
      preloadedState: preloadedState ? preloadedState : {},
    });
};
