"use client";
import { Provider } from "react-redux";
import ToastNotification from "./utils/Toast";
import { store, persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";

const { ToastContainer } = ToastNotification;

export const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
      <ToastContainer />
    </Provider>
  );
};
