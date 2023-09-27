import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import AllCurrenciesPageBody from '../../../components/all_currencies_page_body/all_currencies_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../../../interfaces/locale';

const CurrenciesPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Crypto Currencies - BAIFA</title>
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
