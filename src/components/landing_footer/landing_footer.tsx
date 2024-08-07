import {BiLogoGithub} from 'react-icons/bi';
import {BsTelephone} from 'react-icons/bs';
import {FiMapPin} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import {
  copyright,
  baifaAddress,
  baifaAddressOnMap,
  baifaPhone,
  githubLink,
} from '@/constants/config';
import {BFAURL} from '@/constants/url';

const LandingFooter = () => {
  return (
    <div className="flex flex-col space-y-12 bg-darkPurple px-4 py-12 font-roboto font-roboto drop-shadow-xlReverse lg:px-20">
      <div className="flex flex-col items-center space-y-6 lg:flex-row lg:space-x-20 lg:space-y-0">
        <Link href={BFAURL.HOME}>
          {/* Info:(20230711 - Julian) Desktop Logo */}
          <Image
            className="hidden lg:block"
            src={'/logo/baifa_logo_small.svg'}
            alt="baifaaa_logo"
            width={75}
            height={100}
          />
          {/* Info:(20230711 - Julian) Mobile Logo */}
          <Image
            className="block lg:hidden"
            src={'/logo/baifaaa_logo.svg'}
            alt="baifaaa_logo"
            width={192}
            height={40}
          />
        </Link>

        <div className="flex flex-1 flex-col items-center space-y-6 text-sm lg:flex-row lg:space-x-6 lg:space-y-0 lg:divide-x lg:divide-white">
          <div className="flex flex-col items-start space-y-4">
            <Link
              href={baifaAddressOnMap ?? ''}
              target="_blank"
              className="flex items-center space-x-2"
            >
              <FiMapPin className="text-2xl" />
              <p className="w-256px lg:w-auto">{baifaAddress}</p>
            </Link>
            <Link href={`tel:${baifaPhone}`} className="flex items-center space-x-2">
              <BsTelephone className="text-2xl" />
              <p>{baifaPhone}</p>
            </Link>
          </div>
          <Link href={githubLink ?? ''} target="_blank" className="px-6 py-4">
            <BiLogoGithub className="text-40px" />
          </Link>
        </div>
      </div>

      {/* Info:(20230711 - Julian) Copyright */}
      <div className="flex justify-center text-sm lg:justify-end">{copyright}</div>
    </div>
  );
};

export default LandingFooter;
