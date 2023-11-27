import authReducer from "./auth";
import inventoryReducer from "./inventory";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {enableMapSet} from 'immer'

enableMapSet();

const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false,
    }),
});

export default store;
