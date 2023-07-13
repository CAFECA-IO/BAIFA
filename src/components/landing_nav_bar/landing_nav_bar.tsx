import Link from 'next/link';
import Image from 'next/image';
import useOuterClick from '../../lib/hooks/use_outer_click';
import I18n from '../../components/i18n/i18n';
import {BFAURL} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const LandingNavBar = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  /* Info: (20230712 - Julian) close menu when click outer */
  const {targetRef, componentVisible, setComponentVisible} = useOuterClick<HTMLDivElement>(false);

  const clickMenuHandler = () => setComponentVisible(!componentVisible);

  /* Info: (20230712 - Julian) desktop navbar */
  const desktopNavBar = (
    <div className="hidden h-80px w-screen items-center bg-darkPurple px-10 py-3 text-white shadow-xl lg:flex">
      <div className="flex flex-1 space-x-5">
        <Link href={BFAURL.LANDING_PAGE}>
          <Image src="/logo/baifaaa_logo.svg" width={190} height={40} alt="bolt_logo" />
        </Link>
      </div>
      <ul className="flex items-center space-x-10">
        <li>
          <I18n />
        </li>
        <li>
          <Link
            href={BFAURL.HOME}
            className="rounded-lg bg-violet px-10 py-3 text-white hover:bg-hoverWhite hover:text-black"
          >
            {t('NAV_BAR.LAUNCH_APP')}
          </Link>
        </li>
      </ul>
    </div>
  );

  /* Info: (20230712 - Julian) mobile navbar */
  const mobileNavBar = (
    <div
      ref={targetRef}
      className="relative flex h-80px w-screen items-center justify-center bg-darkPurple p-4 text-white shadow-xl lg:hidden"
    >
      {/* Info: (20230712 - Julian) hamburger */}
      <button className="absolute left-4 p-10px" onClick={clickMenuHandler}>
        <Image src="/icons/hamburger.svg" width={24} height={24} alt="hamburger_icon" />
      </button>
      <div className="">
        <Link href={BFAURL.LANDING_PAGE}>
          <Image src="/logo/baifa_logo_small.svg" width={44} height={60} alt="bolt_logo" />
        </Link>
      </div>
      <ul
        className={`absolute left-0 top-0 mt-80px flex h-screen w-80vw flex-col items-center overflow-hidden bg-darkPurple2 px-5 ${
          componentVisible ? 'visible translate-x-0' : 'invisible -translate-x-full'
        } drop-shadow-xlSide transition-all duration-300 ease-in-out`}
      >
        <li className="px-10 py-4">
          <Link href={BFAURL.HOME} className="px-10 py-4">
            {t('NAV_BAR.LAUNCH_APP')}
          </Link>
        </li>
        <li className="px-10 py-4">
          <I18n />
        </li>
      </ul>
    </div>
  );

  return (
    <div className="container fixed inset-x-0 top-0 z-40 mx-auto max-w-full font-inter">
      {desktopNavBar}
      {mobileNavBar}
    </div>
  );
};

export default LandingNavBar;
