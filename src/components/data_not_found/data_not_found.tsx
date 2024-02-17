import Image from 'next/image';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';

const DataNotFound = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <div className="flex w-full h-280px gap-2 flex-col items-center justify-center rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      <Image src="/elements/no_data.svg" alt="data_not_found" width={160} height={160} />
      <p className="font-base">{t('COMMON.NO_DATA')}</p>
    </div>
  );
};

export default DataNotFound;
