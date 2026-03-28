import { createSlice } from "@reduxjs/toolkit";

const resourcesSlice = createSlice({
  name: "resources",
  initialState: { items: [] as string[] },
  reducers: {},
});

export const resourcesReducer = resourcesSlice.reducer;
