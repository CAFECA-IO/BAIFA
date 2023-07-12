import Link from 'next/link';
import Image from 'next/image';
import I18n from '../../components/i18n/i18n';
import {BFAURL} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const LandingNavBar = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const desktopNavBar = (
    <div className="hidden h-80px w-screen items-center bg-darkPurple px-10 py-3 text-white lg:flex">
      <div className="flex flex-1 space-x-5">
        <Link href={BFAURL.LANDING_PAGE}>
          <Image
            src="/logo/baifaaa_logo.svg"
            className="hidden lg:block"
            width={190}
            height={40}
            alt="bolt_logo"
          />
          <Image
            src="/logo/baifa_logo_small.svg"
            className="block lg:hidden"
            width={44}
            height={60}
            alt="bolt_logo"
          />
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

  const mobileNavBar = (
    <div className="flex h-80px w-screen items-center bg-darkPurple p-4 text-white lg:hidden">
      <div className="flex flex-1 space-x-5">
        <Link href={BFAURL.LANDING_PAGE}>
          <Image
            src="/logo/baifaaa_logo.svg"
            className="hidden lg:block"
            width={190}
            height={40}
            alt="bolt_logo"
          />
          <Image
            src="/logo/baifa_logo_small.svg"
            className="block lg:hidden"
            width={44}
            height={60}
            alt="bolt_logo"
          />
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

  return (
    <div className="container fixed inset-x-0 top-0 z-40 mx-auto max-w-full font-inter shadow-xl">
      {desktopNavBar}
      {mobileNavBar}
    </div>
  );
};

export default LandingNavBar;
