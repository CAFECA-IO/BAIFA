import Head from 'next/head';
import LandingNavBar from '../components/landing_nav_bar/landing_nav_bar';
import LandingFooter from '../components/landing_footer/landing_footer';
import Image from 'next/image';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../interfaces/locale';

const ComingSoonPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Coming Soon - BAIFA</title>
      </Head>

      {/* Info:(20230711 - Julian) Navbar */}
      <LandingNavBar />

      <main className="flex min-h-screen flex-col justify-between">
        <div className="relative flex h-full w-full flex-1 flex-col items-center justify-center overflow-hidden font-inter">
          {/* Info: (20230727 - Julian) neon background */}
          <div className="absolute -z-10 h-full w-full bg-neon bg-cover bg-no-repeat backdrop-blur-2xl"></div>
          <div className="">
            <Image
              src="/animations/running.gif"
              width={150}
              height={148}
              alt="An animation of an astronaut running in space"
            />
          </div>
          <div className="flex flex-col items-center space-y-8 px-4">
            <h1 className="text-40px font-bold text-hoverWhite lg:text-6xl">
              {t('COMING_SOON_PAGE.TITLE')}
            </h1>
            <p className="text-center text-base text-primaryBlue lg:text-xl">
              {t('COMING_SOON_PAGE.SUBTITLE')}
            </p>
          </div>
        </div>
      </main>
      {/* Info:(20230711 - Julian) Footer */}
      <LandingFooter />
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default ComingSoonPage;
