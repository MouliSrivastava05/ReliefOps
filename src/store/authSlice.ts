import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null as string | null },
  reducers: {},
});

export const authReducer = authSlice.reducer;
