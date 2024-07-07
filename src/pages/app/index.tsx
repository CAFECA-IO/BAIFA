import {useContext, useEffect} from 'react';
import Head from 'next/head';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '@/interfaces/locale';
import {AppContext} from '@/contexts/app_context';
import NavBar from '@/components/nav_bar/nav_bar';
import HomePageBody from '@/components/home_page_body/home_page_body';

const Home = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);

  const headTitle = `${t('HOME_PAGE.BREADCRUMB_TITLE')} - BAIFA`;

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
        <HomePageBody />
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

export default Home;
