import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HomePageBody from '../components/home_page_body/home_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/locale';

const Home = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <title>BAIFAAA</title>
        <meta name="description" content="" />
        <meta name="author" content="CAFECA" />
        <meta name="keywords" content="區塊鏈,人工智慧" />

        <meta property="og:title" content="BAIFAAA" />
        <meta property="og:description" content="" />
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
