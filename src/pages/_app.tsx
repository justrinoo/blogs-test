import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import theme from '../theme/themeConfig';
import { NotificationProvider } from '@/shared/hooks/useNotification';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={theme}>
      <StyleProvider layer>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </StyleProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
