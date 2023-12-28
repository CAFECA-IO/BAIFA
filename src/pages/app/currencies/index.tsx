import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import AllCurrenciesPageBody from '../../../components/all_currencies_page_body/all_currencies_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';

const CurrenciesPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);

  const headTitle = `${t('CURRENCIES_PAGE.BREADCRUMB_TITLE')} - BAIFA`;

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />

      <main>
        <AllCurrenciesPageBody />
      </main>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default CurrenciesPage;
