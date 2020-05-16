import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";

import structuresSlice from "./structures.slice";

const reducer = {
  structures: structuresSlice,
};
const middleware = [...getDefaultMiddleware(), logger];

export const getStore = (preloadedState: any) => {
    return configureStore({
      reducer,
      middleware,
      devTools: process.env.NODE_ENV !== "production",
      preloadedState: preloadedState ? preloadedState : {},
    });
};
