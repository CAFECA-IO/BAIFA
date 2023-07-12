import Head from 'next/head';
import NavBar from '../../components/nav_bar/nav_bar';
import HomePageBody from '../../components/home_page_body/home_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../../interfaces/locale';

const Home = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <title>BAIFA - APP</title>
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
