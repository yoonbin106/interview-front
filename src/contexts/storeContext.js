// src/context/StoreContext.js
import React, { createContext, useContext } from 'react';
import authStore from '@/stores/authStore';
import userStore from '@/stores/userStore';
import reduxStore from '@/redux/store';
import payStore from '@/stores/payStore';
import interviewStore from '@/stores/interviewStore';
import mqttStore from '@/stores/mqttStore';
import viewUserStore from 'stores/viewUserStore';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const stores = {
    authStore,
    userStore,
    viewUserStore,
    reduxStore,
    payStore,
    interviewStore,
    mqttStore
  };
  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => useContext(StoreContext);