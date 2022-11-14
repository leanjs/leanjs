import { configureStore } from "@reduxjs/toolkit";

import dashboard from "./slice";

export const store = configureStore({
  reducer: { dashboard },
});

export type RootState = ReturnType<typeof store.getState>;
