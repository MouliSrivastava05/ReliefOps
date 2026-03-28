import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { requestsReducer } from "./requestsSlice";
import { resourcesReducer } from "./resourcesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    resources: resourcesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
