import { configureStore } from "@reduxjs/toolkit";

import home from "./components/home/slice";

export const store = configureStore({
  reducer: { home },
});

export type RootState = ReturnType<typeof store.getState>;
