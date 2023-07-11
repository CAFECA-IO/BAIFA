import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/locale';
import Footer from '../components/footer/footer';

const LandingPage = () => {
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
        <div className="flex min-h-screen w-screen flex-col overflow-hidden">
          <div className="relative flex flex-1 flex-col items-center justify-center space-y-12 bg-gradient bg-cover bg-no-repeat px-10 text-center font-inter">
            <h1 className="text-6xl font-bold">Simplify Financial Investigations with Ease</h1>
            <h2 className="text-lg font-normal">
              BAIFA: BOLT AI Forensic Accounting and Auditing is where simplicity meets accuracy in
              the realm of financial investigations.{' '}
            </h2>

            <div className="absolute bottom-10">
              <Image src="/animations/arrow_down.gif" alt="scroll arrow" width={50} height={50} />
            </div>
          </div>
        </div>

        <Footer />
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
