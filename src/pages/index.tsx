import Head from 'next/head';
import {useEffect} from 'react';
import LandingNavBar from '../components/landing_nav_bar/landing_nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/locale';
import LandingPageBody from '../components/landing_page_body/landing_page_body';
import reportWebVitals from '../reportWebVitals';

const LandingPage = () => {
  useEffect(() => {
    // Deprecated: for test (20230928 - Julian)
    // eslint-disable-next-line no-console
    reportWebVitals(console.log);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>BAIFA</title>
        <meta
          name="description"
          content="BAIFA: BOLT AI Forensic Accounting and Auditing is where simplicity meets accuracy in the realm of financial investigations."
        />
        <meta name="author" content="CAFECA" />
        <meta name="keywords" content="區塊鏈,人工智慧,會計" />

        <meta property="og:title" content="BAIFA" />
        <meta
          property="og:description"
          content="BAIFA: BOLT AI Forensic Accounting and Auditing is where simplicity meets accuracy in the realm of financial investigations."
        />
      </Head>

      {/*  Info:(20230712 - Julian) Navbar */}
      <LandingNavBar />

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
