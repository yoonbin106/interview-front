// src/pages/_app.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from '@/contexts/storeContext';
import '@/styles/globals.css'; // 전역 스타일 경로 수정
import store from '@/redux/store';
import Header from '@/components/layout/header'; // 경로 수정
import Footer from '@/components/layout/footer'; // 경로 수정
import Bot from '@/pages/bot/bot';
import SpeedDial from '@/pages/bot/speedDial';
import { Provider, useDispatch } from 'react-redux';
import { ChatProvider } from '@/contexts/chatContext';
import Chatting from './chat/chatting';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <StoreProvider>
        <ChatProvider>
            <div className="app">
              <Header />
              <div className="content">
                <Component {...pageProps}/>
              </div>
              <Footer />
              <SpeedDial />
              <Bot />
            </div>
          </ChatProvider>
        </StoreProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;