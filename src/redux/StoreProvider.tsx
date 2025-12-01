"use client"; 
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store" ; 
interface Props {
  children: ReactNode;
  loading?: ReactNode;  
}

const StoreProvider: React.FC<Props> = ({ children, loading = null }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={loading} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
