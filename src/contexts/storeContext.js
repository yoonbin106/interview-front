// src/context/StoreContext.js
import React, { createContext, useContext } from 'react';
import authStore from '@/stores/authStore';
import userStore from '@/stores/userStore';
import reduxStore from '@/redux/store';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const stores = {
    authStore,
    userStore,
    reduxStore,
  };
  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => useContext(StoreContext);