import Link from 'next/link';
import Image from 'next/image';
import {BFAURL} from '../../constants/url';
import {BiLogoGithub, BiLogoLinkedin} from 'react-icons/bi';
import {copyright} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const LandingFooter = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
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
  );
};

export default LandingFooter;
