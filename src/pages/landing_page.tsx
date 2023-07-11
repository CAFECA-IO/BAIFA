import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/locale';
import LandingPageBody from '../components/landing_page_body/landing_page_body';

const LandingPage = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <title>BAIFA</title>
        <meta name="description" content="" />
        <meta name="author" content="CAFECA" />
        <meta name="keywords" content="區塊鏈,人工智慧" />

        <meta property="og:title" content="BAIFA" />
        <meta property="og:description" content="" />
      </Head>

      <NavBar />

      <main>
        <LandingPageBody />
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

export default LandingPage;
