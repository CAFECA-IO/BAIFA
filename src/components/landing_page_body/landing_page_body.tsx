import Image from 'next/image';
import Link from 'next/link';
import LandingFooter from '../landing_footer/landing_footer';
import {massiveDataContent, toolsContent} from '../../constants/config';
import {BFAURL} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const LandingPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const massiveDataList = massiveDataContent.map(({icon, text, alt}) => {
    return (
      <div className="flex flex-col items-center space-y-4 px-4" key={alt}>
        <div className="relative h-50px w-50px">
          <Image src={icon} alt={alt} fill style={{objectFit: 'contain'}} />
        </div>
        <p className="text-base font-normal lg:text-lg">{t(text)}</p>
      </div>
    );
  });

  const toolsList = (
    <div className="flex flex-col items-center">
      {toolsContent.map(({title, description, desktopImg, mobileImg, alt}) => (
        <div
          className="flex w-full flex-col items-center justify-between space-y-8 px-4 py-12 lg:space-y-0 lg:p-20 lg:odd:flex-row lg:even:flex-row-reverse"
          key={alt}
        >
          {/* Info:(20230712 - Julian) Mobile Image */}
          <div className="relative block h-300px w-screen lg:hidden">
            <Image src={mobileImg} alt={alt} fill style={{objectFit: 'contain'}} />
          </div>

          <div className="flex flex-col space-y-6 lg:mx-10 lg:w-1/2 lg:space-y-12">
            <h2 className="text-2xl font-bold lg:text-40px">{t(title)}</h2>
            <p className="text-base lg:text-lg">{t(description)}</p>
          </div>

          {/* Info:(20230712 - Julian) Desktop Image */}
          <div className="relative hidden h-400px w-600px lg:block">
            <Image src={desktopImg} alt={alt} fill style={{objectFit: 'contain'}} />
          </div>
        </div>
      ))}
    </div>
  );

  const downloadBlock = (
    <div className="flex justify-center overflow-hidden">
      <div className="flex w-full flex-col items-center rounded-t-full bg-violet pt-12 font-roboto lg:flex-row lg:justify-center lg:px-20">
        {/* Info:(20230712 - Julian) Desktop Image */}
        <div className="relative -mb-16 hidden h-600px w-600px lg:block">
          <Image src="/elements/rectangle.png" alt="baifa_app" fill style={{objectFit: 'cover'}} />
        </div>

        <div className="flex w-full flex-col items-center lg:w-auto lg:items-start lg:space-y-16 lg:px-10">
          <div className="flex flex-col items-center space-y-6 lg:items-start lg:space-y-12">
            <h2 className="whitespace-nowrap text-2xl font-bold lg:text-6xl">
              {t('LANDING_PAGE.DOWNLOAD_TITLE')}
            </h2>
            <p className="text-base lg:text-lg">{t('LANDING_PAGE.DOWNLOAD_SUBTITLE')}</p>
          </div>
          <div className="mt-12 flex items-center space-x-4">
            <Link href={BFAURL.COMING_SOON}>
              <Image
                src="/elements/app_store_button.svg"
                alt="app_store_download"
                width={120}
                height={40}
              />
            </Link>
            <Link href={BFAURL.COMING_SOON}>
              <Image
                src="/elements/google_play_button.svg"
                alt="google_play_download"
                width={135}
                height={40}
              />
            </Link>
          </div>

          {/* Info:(20230712 - Julian) Mobile Image */}
          <div className="relative -mb-16 block h-500px w-400px lg:hidden">
            <Image
              src="/elements/rectangle.png"
              alt="baifa_app"
              fill
              style={{objectFit: 'cover'}}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden font-inter">
      {/* Info:(20230815 - Julian) Pipe Background Image */}
      <div className="relative flex h-120vh w-full flex-col items-center bg-pipe bg-cover bg-top-4 bg-no-repeat">
        {/* Info:(20230711 - Julian) Main Title Block */}
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-10 px-4 py-12 text-center">
          <h6 className="font-roboto text-6xl font-bold tracking-wider lg:text-7xl">
            {t('LANDING_PAGE.MAIN_TITLE')}
          </h6>
          <h1 className="text-2xl tracking-wide text-hoverWhite lg:text-6xl">
            {t('LANDING_PAGE.MAIN_SUBTITLE_1')}
          </h1>
          <h1 className="text-2xl tracking-wide text-hoverWhite lg:text-6xl">
            {t('LANDING_PAGE.MAIN_SUBTITLE_2')}
          </h1>
          {/* Info:(20230711 - Julian) Arrow */}
          <Link href="#baifa_101" scroll={false} className="absolute bottom-20">
            <Image src="/animations/arrow_down.gif" alt="scroll arrow" width={50} height={50} />
          </Link>
        </div>
      </div>

      <div className="flex h-fit w-full flex-col items-center bg-lightBalls bg-cover bg-top bg-no-repeat pb-60">
        {/* Info:(20230815 - Julian) Baifa 101 Block */}
        <div id="baifa_101" className="w-full px-20 py-120px">
          <div className="flex items-center space-x-20 rounded-2xl bg-101 bg-cover bg-center bg-no-repeat p-20 drop-shadow-101">
            <div className="flex h-full w-1/2 flex-col space-y-10 whitespace-nowrap">
              <h2 className="text-6xl font-bold">{t('LANDING_PAGE.BAIFA_101_TITLE')}:</h2>
              <div className="w-fit rounded-xl bg-darkPurple3 px-5 py-10px">
                {t('LANDING_PAGE.BAIFA_101_SUBTITLE')}
              </div>
            </div>
            <div className="w-2/3">
              <p className="text-xl">{t('LANDING_PAGE.BAIFA_101_CONTENT')}</p>
            </div>
          </div>
        </div>

        {/* Info:(20230711 - Julian) Features Block */}
        <div className="flex flex-col items-center space-y-16 px-4 py-20 text-center font-roboto lg:h-450px lg:px-20">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-primaryBlue">
              {t('LANDING_PAGE.FEATURES_SUBTITLE')}
            </h3>
            <h2 className="text-2xl font-bold lg:text-5xl">{t('LANDING_PAGE.FEATURES_TITLE')}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">{massiveDataList}</div>
        </div>
      </div>

      <div className="flex h-fit w-full flex-col items-center bg-lightBalls bg-cover bg-top bg-no-repeat">
        <div className="flex flex-col p-20">
          <h2>Awesome Services We Offer</h2>
        </div>
      </div>

      {/* Info:(20230711 - Julian) Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPageBody;
