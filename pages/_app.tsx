import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';

import { NavBar } from '@/components/layout/NavBar';
import { WSProvider } from '@/services/providers/WSProvider';
import { FiltersProvider } from '@/services/providers/FiltersProvider';
import { ModalsProvider } from '@/services/providers/ModalsProvider';
import { VendorsProvider } from '@/services/providers/VendorsProvider';
import { theme } from '@/styles/theme';
import { createEmotionCache } from '@/utils/createEmotionCache';

import '@/styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

type Props = AppProps & {
  emotionCache?: ReturnType<typeof createEmotionCache>;
};

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: Props) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <WSProvider>
          <VendorsProvider>
            <FiltersProvider>
              <ModalsProvider>
                <NavBar />
                <Component {...pageProps} />
              </ModalsProvider>
            </FiltersProvider>
          </VendorsProvider>
        </WSProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
