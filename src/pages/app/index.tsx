import Head from 'next/head';
import NavBar from '../../components/nav_bar/nav_bar';
import HomePageBody from '../../components/home_page_body/home_page_body';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../contexts/app_context';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../interfaces/locale';

const Home = () => {
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
        <title>{t('HOME_PAGE.BREADCRUMB_TITLE')} - BAIFA</title>
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
