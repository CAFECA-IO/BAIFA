import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import I18n from '../i18n/i18n';
import User from '../user/user';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';

const NavBar = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [isLogin, setIsLogin] = useState(false);

  /* Info: (20230712 - Julian) left menu = hamburger menu */
  const {
    targetRef: hamburgerRef,
    componentVisible: hamburgerVisible,
    setComponentVisible: setHamburgerVisible,
  } = useOuterClick<HTMLDivElement>(false);

  /* Info: (20230712 - Julian) right menu = profile menu */
  const {
    targetRef: profileRef,
    componentVisible: profileVisible,
    setComponentVisible: setProfileVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const loginHandler = () => setIsLogin(!isLogin);
  const hamburgerClickHandler = () => setHamburgerVisible(!hamburgerVisible);
  const profileClickHandler = () => setProfileVisible(!profileVisible);

  // ToDo: (20230614 - Julian) log in function
  const isDisplayedUser = isLogin ? (
    <User isLogin={isLogin} setIsLogin={setIsLogin} />
  ) : (
    <button
      className="rounded bg-primaryBlue px-7 py-2 text-black hover:bg-hoverWhite"
      onClick={loginHandler}
    >
      {t('NAV_BAR.WALLET_CONNECT_BUTTON')}
    </button>
  );

  const isDisplayedProfileMenu = isLogin ? (
    <User isLogin={isLogin} setIsLogin={setIsLogin} />
  ) : (
    /* Info: (20230712 - Julian) wallet connect button */
    <button
      className="mx-5 my-20 rounded bg-primaryBlue px-10 py-3 text-black hover:bg-hoverWhite"
      onClick={loginHandler}
    >
      {t('NAV_BAR.WALLET_CONNECT_BUTTON')}
    </button>
  );

  const desktopNavBar = (
    <div className="hidden h-80px w-screen items-center bg-darkPurple px-10 py-3 text-white lg:flex">
      <div className="flex flex-1 space-x-5">
        <Link href={BFAURL.APP}>
          <Image src="/logo/baifaaa_logo.svg" width={190} height={40} alt="bolt_logo" />
        </Link>

        <I18n />
      </div>
      <div className="flex items-center space-x-10">
        {/* ToDo: (20230727 - Julian) page link */}
        <div className="text-white hover:text-primaryBlue">
          <Link href={BFAURL.COMING_SOON}>{t('NAV_BAR.TRACING_TOOL')}</Link>
        </div>
        <div className="text-white hover:text-primaryBlue">
          <Link href={BFAURL.COMING_SOON}>{t('NAV_BAR.AUDITING_TOOL')}</Link>
        </div>
        <div className="text-white hover:text-primaryBlue">
          <Link href={BFAURL.COMING_SOON}>{t('NAV_BAR.RED_FLAG')}</Link>
        </div>
        <div className="text-white hover:text-primaryBlue">
          <Link href={BFAURL.COMING_SOON}>{t('NAV_BAR.FAQ')}</Link>
        </div>

        {isDisplayedUser}
      </div>
    </div>
  );

  const hamburgerMenu = (
    <ul
      className={`absolute left-0 top-0 mt-80px flex h-screen w-80vw flex-col items-center overflow-hidden bg-darkPurple2 px-5 ${
        hamburgerVisible ? 'visible translate-x-0' : 'invisible -translate-x-full'
      } drop-shadow-xlSide transition-all duration-300 ease-in-out`}
    >
      <li className="px-10 py-4">
        <Link href={BFAURL.TRACING_TOOL} className="px-10 py-4">
          {t('NAV_BAR.TRACING_TOOL')}
        </Link>
      </li>
      <li className="px-10 py-4">
        <Link href={BFAURL.AUDITING_TOOL} className="px-10 py-4">
          {t('NAV_BAR.AUDITING_TOOL')}
        </Link>
      </li>
      <li className="px-10 py-4">
        <Link href={BFAURL.RED_FLAG} className="px-10 py-4">
          {t('NAV_BAR.RED_FLAG')}
        </Link>
      </li>
      <li className="px-10 py-4">
        <Link href={BFAURL.FAQ} className="px-10 py-4">
          {t('NAV_BAR.FAQ')}
        </Link>
      </li>
      <li className="px-10 py-4">
        <I18n />
      </li>
    </ul>
  );

  // ToDo: (20230614 - Julian) log in menu
  const profileMenu = (
    <div
      className={`absolute right-0 top-0 flex h-screen w-80vw flex-col items-center overflow-hidden bg-darkPurple2 ${
        profileVisible ? 'visible translate-x-0' : 'invisible translate-x-full'
      } mt-80px drop-shadow-xlSide transition-all duration-300 ease-in-out`}
    >
      {isDisplayedProfileMenu}
    </div>
  );

  const mobileNavBar = (
    <div className="relative flex h-80px w-screen items-center justify-center bg-darkPurple p-4 text-white shadow-xl lg:hidden">
      {/* Info: (20230712 - Julian) hamburger */}
      <button className="absolute left-4 p-10px" onClick={hamburgerClickHandler}>
        <Image src="/icons/hamburger.svg" width={24} height={24} alt="hamburger_icon" />
      </button>

      {/* Info: (20230712 - Julian) logo */}
      <Link href={BFAURL.APP}>
        <Image src="/logo/baifa_logo_small.svg" width={44} height={60} alt="bolt_logo" />
      </Link>

      {/* Info: (20230712 - Julian) profile */}
      <button className="absolute right-4 p-10px" onClick={profileClickHandler}>
        <Image src="/icons/profile.svg" width={24} height={24} alt="profile_icon" />
      </button>

      {/* Info: (20230712 - Julian) hamburger menu */}
      <div ref={hamburgerRef}>{hamburgerMenu}</div>

      {/* Info: (20230712 - Julian) profile menu */}
      <div ref={profileRef}>{profileMenu}</div>
    </div>
  );

  return (
    <>
      <div className="container fixed inset-x-0 top-0 z-40 mx-auto max-w-full font-inter shadow-xl">
        {desktopNavBar}
        {mobileNavBar}
      </div>
    </>
  );
};

export default NavBar;
