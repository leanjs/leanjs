import { configureStore } from "@reduxjs/toolkit";

import dashboard from "./components/dashboard/slice";

export const store = configureStore({
  reducer: { dashboard },
});

export type RootState = ReturnType<typeof store.getState>;
