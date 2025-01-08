import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@/features/auth/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/auth";
import { resourceApi } from "@/services/resource";

const store = configureStore({
  reducer: {
    auth: userSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [resourceApi.reducerPath]: resourceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(resourceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

setupListeners(store.dispatch);

export default store;
