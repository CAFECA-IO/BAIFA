import Head from 'next/head';
import LandingNavBar from '../components/landing_nav_bar/landing_nav_bar';
import LandingFooter from '../components/landing_footer/landing_footer';
import Image from 'next/image';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../interfaces/locale';

const ContactUsPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>BAIFA - Contact Us</title>
      </Head>
      {/* Info:(20230731 - Julian) Navbar */}
      <LandingNavBar />

      <main className="flex min-h-screen flex-col justify-between">
        <div className="relative mt-80px flex flex-1 flex-col items-center justify-center overflow-hidden font-roboto">
          {/* Info:(20230731 - Julian) Bubble on the top */}
          <div className="absolute -z-10 h-full w-full bg-bubbleAbove bg-contain bg-right-top bg-no-repeat"></div>
          {/* Info:(20230731 - Julian) Bubble on the bottom */}
          <div className="absolute -z-10 h-full w-full bg-bubbleBelow bg-contain bg-left-bottom bg-no-repeat"></div>

          <div className="mx-auto my-auto flex h-auto flex-col items-center space-y-12 border-2 border-violet bg-purpleLinear2 p-12 shadow-violet backdrop-blur-lg">
            <h1 className="text-5xl font-bold">Get In Touch</h1>

            {/* Info:(20230731 - Julian) Form */}
            <div className="flex flex-col items-center space-y-4">
              {/* Info:(20230731 - Julian) Name & Phone */}
              <div className="flex items-center space-x-4">
                {/* Info:(20230731 - Julian) Name */}
                <div className="flex flex-col items-start space-y-2">
                  <p className="text-sm">Name</p>
                  <input
                    type="text"
                    className="h-12 border border-violet bg-transparent px-4 py-3 text-base text-white placeholder-lilac placeholder-opacity-90 shadow-purple"
                    placeholder="Name"
                  />
                </div>
                {/* Info:(20230731 - Julian) Phone Number */}
                <div className="flex flex-col items-start space-y-2">
                  <p className="text-sm">Phone Number</p>
                  <input
                    type="text"
                    className="h-12 border border-violet bg-transparent px-4 py-3 text-base text-white placeholder-lilac placeholder-opacity-90 shadow-purple"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Info:(20230731 - Julian) Email */}
              <div className="flex w-full flex-col items-start space-y-2">
                <p className="text-sm">Email</p>
                <input
                  type="text"
                  className="h-12 w-full border border-violet bg-transparent px-4 py-3 text-base text-white placeholder-lilac placeholder-opacity-90 shadow-purple"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Info:(20230731 - Julian) Footer */}
        <LandingFooter />
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

export default ContactUsPage;
