import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage as default
import authSlice from "../slice/authSlice";
import notificationSlice from "../slice/notificationSlice";
import { decryptData, encryptData } from "@/app/utils/crypto";

const EncryptTransform = createTransform(
  (inboundState, key) => encryptData(inboundState),
  (outboundState, key) => decryptData(outboundState)
);

const persistConfig = {
  key: "auth",
  storage,
  transforms: [EncryptTransform],
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    user: persistedAuthReducer,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for redux-persist
    }),
});

export const persistor = persistStore(store);
