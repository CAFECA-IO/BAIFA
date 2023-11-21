import {useState} from 'react';
import {useRouter} from 'next/router';
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

  const navbarContent = [
    {
      name: 'NAV_BAR.TRACING_TOOL',
      link: BFAURL.COMING_SOON,
    },
    {
      name: 'NAV_BAR.AUDITING_TOOL',
      link: BFAURL.COMING_SOON,
    },
    {
      name: 'NAV_BAR.RED_FLAG',
      link: BFAURL.RED_FLAG,
    },
    {
      name: 'NAV_BAR.FAQ',
      link: BFAURL.COMING_SOON,
    },
  ];

  const router = useRouter();
  const {pathname} = router;

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

  // ToDo: (20230614 - Julian) log in function
  const loginHandler = () => setIsLogin(!isLogin);
  const hamburgerClickHandler = () => setHamburgerVisible(!hamburgerVisible);
  const profileClickHandler = () => setProfileVisible(!profileVisible);

  const isDisplayedUser = isLogin ? (
    <User isLogin={isLogin} setIsLogin={setIsLogin} />
  ) : (
    <Link href={BFAURL.COMING_SOON}>
      <button
        className="rounded bg-primaryBlue px-7 py-2 text-black hover:bg-hoverWhite"
        //onClick={loginHandler}
      >
        {t('NAV_BAR.WALLET_CONNECT_BUTTON')}
      </button>
    </Link>
  );

  const isDisplayedProfileMenu = isLogin ? (
    <User isLogin={isLogin} setIsLogin={setIsLogin} />
  ) : (
    /* Info: (20230712 - Julian) wallet connect button */
    <Link href={BFAURL.COMING_SOON}>
      <button
        className="mx-5 my-20 rounded bg-primaryBlue px-10 py-3 text-black hover:bg-hoverWhite"
        //onClick={loginHandler}
      >
        {t('NAV_BAR.WALLET_CONNECT_BUTTON')}
      </button>
    </Link>
  );

  const desktopNavBar = (
    <div className="hidden h-80px w-screen items-center bg-darkPurple px-10 py-3 text-white lg:flex">
      <div className="flex flex-1 space-x-5">
        <Link href={BFAURL.APP}>
          <Image src="/logo/baifaaa_logo.svg" width={190} height={40} alt="BAIFA_logo" />
        </Link>

        <I18n />
      </div>
      <ul className="flex items-center">
        {/* ToDo: (20230727 - Julian) page link */}
        {navbarContent.map((item, index) => (
          <li
            key={index}
            className={`border-b-3px px-4 py-3 text-white hover:text-primaryBlue ${
              pathname === item.link ? 'border-primaryBlue' : 'border-transparent'
            }`}
          >
            <Link href={item.link}>{t(item.name)}</Link>
          </li>
        ))}
        <li className="ml-10">{isDisplayedUser}</li>
      </ul>
    </div>
  );

  const hamburgerMenu = (
    <ul
      className={`absolute left-0 top-0 mt-80px flex h-screen w-80vw flex-col items-center overflow-hidden bg-darkPurple2 px-5 ${
        hamburgerVisible ? 'visible translate-x-0' : 'invisible -translate-x-full'
      } drop-shadow-xlSide transition-all duration-300 ease-in-out`}
    >
      {navbarContent.map((item, index) => (
        <li key={index} className="px-10 py-4">
          <Link href={item.link} className="px-10 py-4">
            {t(item.name)}
          </Link>
        </li>
      ))}
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
        <Image src="/logo/baifa_logo_small.svg" width={44} height={60} alt="BAIFA_logo" />
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
