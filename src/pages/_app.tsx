import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {AppProvider} from '../contexts/app_context';
import {MarketProvider} from '../contexts/market_context';
import {GlobalProvider} from '../contexts/global_context';

const App = ({Component, pageProps}: AppProps) => {
  return (
    <GlobalProvider>
      <MarketProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </MarketProvider>
    </GlobalProvider>
  );
};

export default appWithTranslation(App);
