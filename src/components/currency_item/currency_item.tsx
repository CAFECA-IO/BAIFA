import Image from 'next/image';
import {getChainIcon} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

interface ICurrencyItemProps {
  currencyId: string;
  currencyName: string;
  rank: number;
  stabilityLevel: string;
}

const CurrencyItem = ({currencyId, currencyName, rank, stabilityLevel}: ICurrencyItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const chainIcon = getChainIcon(currencyId);

  const stabilityColor =
    stabilityLevel === 'HIGH_RISK'
      ? '#FC8181'
      : stabilityLevel === 'MEDIUM_RISK'
      ? '#FFA600'
      : '#3DD08C';
  const stabilityText =
    stabilityLevel === 'HIGH_RISK'
      ? t('CURRENCIES_PAGE.RISK_HIGH')
      : stabilityLevel === 'MEDIUM_RISK'
      ? t('CURRENCIES_PAGE.RISK_MEDIUM')
      : t('CURRENCIES_PAGE.RISK_LOW');

  // ToDo: (20230927 - Julian) Add link to currency detail page
  return (
    <div className="flex w-full items-center border-b border-darkPurple4 p-5 font-inter">
      {/* Info: (20230927 - Julian) Rank */}
      <div className="w-40px text-xl font-semibold">#{rank}</div>
      {/* Info: (20230927 - Julian) Currency Name & Icon */}
      <div className="flex flex-1 items-center space-x-2">
        <Image src={chainIcon.src} width={30} height={30} alt={chainIcon.alt} />
        <p className="text-xl font-semibold">{currencyName}</p>
      </div>
      {/* Info: (20230907 - Julian) Stability */}
      <div className="flex items-center space-x-2 px-2">
        {/* Info: (20230907 - Julian) The circle svg */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill={stabilityColor} />
        </svg>
        <p className="text-sm">{stabilityText}</p>
      </div>
    </div>
  );
};

export default CurrencyItem;
