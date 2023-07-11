import Image from 'next/image';
import Link from 'next/link';
import {massiveDataContent, toolsContent, copyright} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {
  BiLogoYoutube,
  BiLogoTwitter,
  BiLogoInstagram,
  BiLogoFacebook,
  BiLogoLinkedin,
} from 'react-icons/bi';

const LandingPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const toolsList = toolsContent.map(({title, description, image, alt}) => {
    return (
      <div
        className="flex w-full items-center justify-between px-20 py-20 odd:flex-row even:flex-row-reverse"
        key={alt}
      >
        <div className="flex w-1/2 flex-col space-y-12">
          <h2 className="text-40px font-bold">{t(title)}</h2>
          <p className="text-lg">{t(description)}</p>
        </div>

        <div className="relative h-400px w-600px">
          <Image src={image} alt={alt} fill sizes="600px, auto" style={{objectFit: 'contain'}} />
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
        <div className="absolute -z-10 h-full w-full bg-gradient bg-cover bg-right bg-no-repeat"></div>

        {/* Info:(20230711 - Julian) Main Title Block */}
        <div className="relative flex h-screen flex-col items-center justify-center space-y-12 px-10 text-center">
          <h1 className="text-6xl font-bold">Simplify Financial Investigations with Ease</h1>
          <h2 className="text-lg font-normal">
            BAIFA: BOLT AI Forensic Accounting and Auditing is where simplicity meets accuracy in
            the realm of financial investigations.
          </h2>

          {/* Info:(20230711 - Julian) Arrow */}
          <div className="absolute bottom-20">
            <Image src="/animations/arrow_down.gif" alt="scroll arrow" width={50} height={50} />
          </div>
        </div>

        {/* Info:(20230711 - Julian) Advantages Block */}
        <div className="flex flex-col items-center space-y-16 px-20 pb-20 text-center font-roboto">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-primaryBlue">ADVANTAGES</h3>
            <h2 className="text-5xl font-bold">Real-time Comparison of Massive Data</h2>
          </div>

          <div className="grid grid-cols-5 gap-x-4">{massiveDataList}</div>
        </div>
      </div>

      {/* Info:(20230711 - Julian) Tools Introduction Block */}
      <div className="flex flex-col items-center">{toolsList}</div>

      {/* Info:(20230711 - Julian) Download Block */}
      <div className="flex overflow-hidden pt-20">
        <div className="flex items-center justify-between rounded-t-full bg-violet px-20 font-roboto">
          <div className="relative -mb-16 h-600px w-600px">
            <Image
              src="/elements/rectangle.png"
              alt="download"
              fill
              sizes="520px,auto"
              style={{objectFit: 'cover'}}
            />
          </div>

          <div className="flex flex-col space-y-16 px-20">
            <div className="flex flex-col space-y-12">
              <h2 className="text-6xl font-bold">Download The App</h2>
              <p className="text-lg">Carry the most useful tool with you</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="">
                <Image
                  src="/elements/app_store_button.svg"
                  alt="app_store_download"
                  width={120}
                  height={40}
                />
              </Link>
              <Link href="">
                <Image
                  src="/elements/google_play_button.svg"
                  alt="google_play_download"
                  width={135}
                  height={40}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Info:(20230711 - Julian) Footer */}
      <div className="">
        <div className="flex flex-col bg-darkPurple px-20 py-12 font-roboto drop-shadow-xlReverse">
          <div className="flex items-start justify-between">
            {/* Info:(20230711 - Julian) Company Info */}
            <p className="text-sm">Company Info</p>
            {/* Info:(20230711 - Julian) Logo */}
            <div className="flex flex-col items-center space-y-12 px-12">
              <Image src="/logo/baifaaa_logo.svg" alt="baifaaa_logo" width={200} height={40} />
              {/* Info:(20230711 - Julian) Copyright */}
              <div className="flex justify-center text-sm">{copyright}</div>
            </div>
            {/* Info:(20230711 - Julian) Social Media */}
            <div className="flex items-center space-x-4 text-2xl">
              <BiLogoYoutube />
              <BiLogoFacebook />
              <BiLogoTwitter />
              <BiLogoInstagram />
              <BiLogoLinkedin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageBody;
