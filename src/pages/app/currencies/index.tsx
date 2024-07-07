import {useContext, useEffect} from 'react';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {TranslateFunction} from '@/interfaces/locale';
import {AppContext} from '@/contexts/app_context';
import AllCurrenciesPageBody from '@/components/all_currencies_page_body/all_currencies_page_body';
import NavBar from '@/components/nav_bar/nav_bar';

const CurrenciesPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);

  const headTitle = `${t('CURRENCIES_PAGE.BREADCRUMB_TITLE')} - BAIFA`;

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
        <AllCurrenciesPageBody />
      </main>
    </>
  );
};

export default CurrenciesPage;

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
