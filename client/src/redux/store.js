import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slice/user.slice";
import storagePkg from 'redux-persist/lib/storage';
import { persistStore, persistReducer} from "redux-persist";

const rootReducer = combineReducers({userReducer:userReducer});

const storage = storagePkg.default || storagePkg;

const persistConfig = {
    key: 'root',
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        //to not get errors for not serializing variables
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
