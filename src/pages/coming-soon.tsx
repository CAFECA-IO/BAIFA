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
        <title>BAIFA - Coming Soon</title>
      </Head>

      <LandingNavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden font-inter">
          <div className="relative flex h-full w-full flex-1 flex-col items-center justify-center">
            <div className="absolute -z-10 h-full w-full bg-neon bg-cover bg-no-repeat backdrop-blur-2xl">
              <div className=""></div>
            </div>
            <div>
              <Image
                src="/animations/running.gif"
                width={150}
                height={148}
                alt="An animation of an astronaut running in space"
              />
            </div>
            <div className="flex flex-col items-center space-y-8">
              <h1 className="text-6xl font-bold text-hoverWhite">{t('COMING_SOON_PAGE.TITLE')}</h1>
              <p className="text-xl text-primaryBlue">{t('COMING_SOON_PAGE.SUBTITLE')}</p>
            </div>
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
