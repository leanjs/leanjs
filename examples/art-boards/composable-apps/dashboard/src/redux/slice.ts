import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  displayAuthor: boolean;
}

const initialState: CounterState = {
  displayAuthor: false,
};

export const counterSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    toggleDisplayAuthor: (state) => {
      state.displayAuthor = !state.displayAuthor;
    },
  },
});

export const { toggleDisplayAuthor } = counterSlice.actions;

export default counterSlice.reducer;
