import {useContext, useEffect} from 'react';
import Head from 'next/head';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '@/interfaces/locale';
import {AppContext} from '@/contexts/app_context';
import AllChainPageBody from '@/components/all_chain_page_body/all_chain_page_body';
import NavBar from '@/components/nav_bar/nav_bar';

const ChainsPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('CHAINS_PAGE.BREADCRUMB_TITLE')} - BAIFA`;

  const appCtx = useContext(AppContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
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
