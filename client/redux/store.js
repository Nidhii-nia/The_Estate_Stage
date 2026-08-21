import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slice/user.slice";

const store = configureStore({
  reducer: {
    userReducer: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        //to not get errors for not serializing variables
      serializableCheck: false,
    }),
});

export default store;
