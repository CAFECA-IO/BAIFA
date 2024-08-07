import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import version from '@/lib/utils/version';
import useOuterClick from '@/lib/hooks/use_outer_click';
import I18n from '@/components/i18n/i18n';

const LandingNavBar = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  /* Info:(20230814 - Julian) Scroll Position */
  const [scroll, setScroll] = useState(0);
  const handleScroll = () => {
    const position = window.scrollY;
    setScroll(position);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* Info:(20230814 - Julian) Change Navbar Background Style */
  const bgStyle = scroll >= 300 ? 'bg-darkPurple shadow-xl' : 'bg-transparent';

  /* Info: (20230712 - Julian) close menu when click outer */
  const {targetRef, componentVisible, setComponentVisible} = useOuterClick<HTMLDivElement>(false);

  const clickMenuHandler = () => setComponentVisible(!componentVisible);

  /* Info: (20230712 - Julian) desktop navbar */
  const desktopNavBar = (
    <div
      className={`hidden h-80px w-screen items-center px-10 py-3 ${bgStyle} text-white transition-all duration-300 ease-in-out lg:flex`}
    >
      <ul className="flex flex-1 space-x-5">
        <li>
          <Link href={BFAURL.HOME}>
            <Image src="/logo/baifaaa_logo.svg" width={190} height={40} alt="BAIFA_logo" />
            <p className="flex justify-end text-xxs text-lightGray">v{version}</p>
          </Link>
        </li>
        <li>
          <I18n />
        </li>
      </ul>
      <ul className="flex items-center space-x-10">
        <li>
          {/* ToDo: (20230727 - Julian) contact us page */}
          <Link href={BFAURL.CONTACT_US}>{t('NAV_BAR.CONTACT_US')}</Link>
        </li>
        <li>
          <Link
            href={BFAURL.APP}
            target="_blank"
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
        <Link href={BFAURL.HOME}>
          <Image src="/logo/baifa_logo_small.svg" width={44} height={60} alt="BAIFA_logo" />
          <p className="flex justify-end text-xxs text-lightGray">v{version}</p>
        </Link>
      </div>
      <ul
        className={`absolute left-0 top-0 mt-80px flex h-screen w-80vw flex-col items-center overflow-hidden bg-darkPurple2 px-5 ${
          componentVisible ? 'visible translate-x-0' : 'invisible -translate-x-full'
        } drop-shadow-xlSide transition-all duration-300 ease-in-out`}
      >
        <li className="px-10 py-4">
          {/* ToDo: (20230727 - Julian) contact us page */}
          <Link href={BFAURL.CONTACT_US} className="px-10 py-4">
            {t('NAV_BAR.CONTACT_US')}
          </Link>
        </li>
        <li className="px-10 py-4">
          <Link href={BFAURL.APP} target="_blank" className="px-10 py-4">
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
