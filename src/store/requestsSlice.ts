import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: { items: [] as string[] },
  reducers: {},
});

export const requestsReducer = requestsSlice.reducer;
