import { NextPageWithLayout } from '@/components/layout/Layout.types';
import LayoutImplementer from '@/components/layout/LayoutImplementer';
import { trpc } from '@/lib/server/trpc';
import GlobalStore from '@/lib/state';
import '@/styles/globals.css';
import { StoreProvider } from 'easy-peasy';
import { SessionProvider } from 'next-auth/react';
import type { AppProps, AppType } from 'next/app';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <StoreProvider store={GlobalStore}>
        <LayoutImplementer getLayout={getLayout}>
          <Component {...pageProps} />
        </LayoutImplementer>
      </StoreProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
