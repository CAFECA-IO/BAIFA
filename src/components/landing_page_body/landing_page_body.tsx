import Image from 'next/image';
import Link from 'next/link';
import {massiveDataContent, toolsContent, copyright} from '../../constants/config';
import {BFAURL} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BiLogoGithub, BiLogoLinkedin} from 'react-icons/bi';

const LandingPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const toolsList = toolsContent.map(({title, description, desktopImg, mobileImg, alt}) => {
    return (
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
    );
  });

  const massiveDataList = massiveDataContent.map(({icon, text, alt}) => {
    return (
      <div className="flex flex-col items-center space-y-4 px-4" key={alt}>
        <div className="relative h-50px w-50px">
          <Image src={icon} alt={alt} fill style={{objectFit: 'contain'}} />
        </div>
        <p className="text-lg font-normal">{t(text)}</p>
      </div>
    );
  });

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden font-inter">
      <div className="relative flex h-auto w-full flex-col items-center">
        {/* Info:(20230711 - Julian) Background Image */}
        <div className="absolute -z-10 h-4/5 w-full bg-gradient bg-cover bg-right bg-no-repeat lg:h-full"></div>

        {/* Info:(20230711 - Julian) Main Title Block */}
        <div className="relative flex h-screen w-full flex-col items-center justify-center space-y-12 px-4 py-12 text-center">
          <h1 className="text-48px font-bold lg:text-6xl">{t('LANDING_PAGE.MAIN_TITLE')}</h1>
          <h2 className="text-base font-normal lg:text-lg">{t('LANDING_PAGE.MAIN_SUBTITLE')}</h2>

          {/* Info:(20230711 - Julian) Arrow */}
          <Link href="#Advantages" scroll={false} className="absolute bottom-20">
            <Image src="/animations/arrow_down.gif" alt="scroll arrow" width={50} height={50} />
          </Link>
        </div>

        {/* Info:(20230711 - Julian) Advantages Block */}
        <div
          id="Advantages"
          className="flex flex-col items-center space-y-16 px-4 py-20 text-center font-roboto lg:px-20"
        >
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-primaryBlue">
              {t('LANDING_PAGE.ADVANTAGES_SUBTITLE')}
            </h3>
            <h2 className="text-2xl font-bold lg:text-5xl">{t('LANDING_PAGE.ADVANTAGES_TITLE')}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">{massiveDataList}</div>
        </div>
      </div>

      {/* Info:(20230711 - Julian) Tools Introduction Block */}
      <div className="flex flex-col items-center">{toolsList}</div>

      {/* Info:(20230711 - Julian) Download Block */}
      <div className="flex justify-center overflow-hidden">
        <div className="flex w-full flex-col items-center rounded-t-full bg-violet pt-12 font-roboto lg:flex-row lg:justify-center lg:px-20">
          {/* Info:(20230712 - Julian) Desktop Image */}
          <div className="relative -mb-16 hidden h-600px w-600px lg:block">
            <Image
              src="/elements/rectangle.png"
              alt="baifa_app"
              fill
              style={{objectFit: 'cover'}}
            />
          </div>

          <div className="flex w-full flex-col items-center lg:w-auto lg:items-start lg:space-y-16 lg:px-10">
            <div className="flex flex-col space-y-6 lg:space-y-12">
              <h2 className="text-2xl font-bold lg:text-6xl">{t('LANDING_PAGE.DOWNLOAD_TITLE')}</h2>
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
            <div className="relative -mb-16 block h-500px w-full lg:hidden">
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

      {/* Info:(20230711 - Julian) Footer */}
      <div className="">
        <div className="flex flex-col space-y-12 bg-darkPurple px-20 py-12 font-roboto drop-shadow-xlReverse">
          <div className="flex flex-col items-center justify-between space-y-12 lg:flex-row lg:space-y-0">
            {/* Info:(20230711 - Julian) Company Info */}
            <p className="hidden text-sm opacity-0 lg:block">{t('FOOTER.COMPANY_INFO')}</p>
            {/* Info:(20230711 - Julian) Logo */}
            <div className="flex items-center lg:px-12">
              <Link href={BFAURL.LANDING_PAGE}>
                <Image src="/logo/baifaaa_logo.svg" alt="baifaaa_logo" width={200} height={40} />
              </Link>
            </div>
            {/* Info:(20230711 - Julian) Social Media */}
            <ul className="flex items-center space-x-4 text-2xl">
              <li>
                <Link href={BFAURL.COMING_SOON}>
                  <BiLogoGithub />
                </Link>
              </li>
              <li>
                <Link href={BFAURL.COMING_SOON}>
                  <BiLogoLinkedin />
                </Link>
              </li>
            </ul>
          </div>

          {/* Info:(20230711 - Julian) Copyright */}
          <div className="flex justify-center text-sm">{copyright}</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageBody;
