import Image from 'next/image';
import Footer from '../footer/footer';
import {massiveDataContent, toolsContent} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const LandingPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const testList = toolsContent.map(({title, description, image, alt}) => {
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

      <div className="flex flex-col items-center">
        {/* Info:(20230711 - Julian) Tools Introduction Block */}
        {testList}
      </div>

      {/* Info:(20230711 - Julian) Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPageBody;
