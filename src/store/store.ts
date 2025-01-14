import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@/features/user/userSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;
