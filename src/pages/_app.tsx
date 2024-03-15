import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import {AppProvider} from '../contexts/app_context';
import {MarketProvider} from '../contexts/market_context';

const App = ({Component, pageProps}: AppProps) => {
  return (
    <MarketProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </MarketProvider>
  );
};

export default appWithTranslation(App);
