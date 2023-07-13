import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {copyright} from '../../constants/config';

const Footer = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <>
      <footer className="flex flex-col bg-darkPurple3 drop-shadow-xlReverse">
        <div className="p-4 text-center text-lilac">
          <h2 className="text-sm font-bold leading-8">{t('FOOTER.POWERED_BY')}</h2>
          <p className="whitespace-pre-line text-xs">{t('FOOTER.ANNOUNCEMENT')}</p>
          <p className="text-xs leading-8">{copyright}</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
