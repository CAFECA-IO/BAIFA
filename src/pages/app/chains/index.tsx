import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import AllChainPageBody from '../../../components/all_chain_page_body/all_chain_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../../interfaces/locale';
import {useTranslation} from 'next-i18next';

const ChainsPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{t('CHAINS_PAGE.BREADCRUMB_TITLE')} - BAIFA</title>
      </Head>

      <NavBar />

      <main>
        <AllChainPageBody />
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

export default ChainsPage;
