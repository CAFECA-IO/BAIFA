import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import AllChainPageBody from '../../../components/all_chain_page_body/all_chain_page_body';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../../../interfaces/locale';

const ChainsPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Chains - BAIFA</title>
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
