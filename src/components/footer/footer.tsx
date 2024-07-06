import {useTranslation} from 'next-i18next';
import {copyright} from '@/constants/config';
import {TranslateFunction} from '@/interfaces/locale';

const Footer = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <>
      <footer className="flex flex-col bg-darkPurple3 p-4 text-center text-lilac drop-shadow-xlReverse lg:h-128px">
        <h2 className="text-sm font-bold leading-8">{t('FOOTER.POWERED_BY')}</h2>
        <p className="flex-1 whitespace-pre-line text-xs">{t('FOOTER.ANNOUNCEMENT')}</p>
        <p className="text-xs leading-8">{copyright}</p>
      </footer>
    </>
  );
};

export default Footer;
