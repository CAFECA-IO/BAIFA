import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {DEFAULT_CURRENCY_ICON} from '@/constants/config';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {getCurrencyIcon} from '@/lib/common';

interface ICurrencyItemProps {
  currencyId: number;
  currencyName: string;
  rank: number;
  riskLevel: string;
  currencyIconId: string;
}

const CurrencyItem = ({
  currencyId,
  currencyName,
  rank,
  riskLevel,
  currencyIconId,
}: ICurrencyItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const currencyIcon = getCurrencyIcon(currencyIconId);

  // Info: (20240222 - Liz) riskLevel 有三種值 Low, Normal, High 要轉換成對應的顏色和文字
  const riskLevelMappings: {[key: string]: {riskColor: string; riskText: string}} = {
    'High': {riskColor: '#FC8181', riskText: t('COMMON.RISK_HIGH')},
    'Normal': {riskColor: '#FFA600', riskText: t('COMMON.RISK_MEDIUM')},
    'Low': {riskColor: '#3DD08C', riskText: t('COMMON.RISK_LOW')},
  };
  // Info: (20240222 - Liz) 如果 riskLevel 從後端傳來的值不是 'High', 'Normal', 'Low' 就預設為 'High'
  const {riskColor, riskText} = riskLevelMappings[riskLevel] ?? riskLevelMappings['High'];

  return (
    <div className="flex w-full items-center border-b border-darkPurple4 p-5 font-inter">
      {/* Info: (20230927 - Julian) Rank */}
      <div className="w-50px text-xl font-semibold">#{rank}</div>
      {/* Info: (20230927 - Julian) Currency Name & Icon */}
      <Link
        href={`${BFAURL.CURRENCIES}/${currencyId}`}
        className="flex flex-1 items-center space-x-2"
      >
        <Image
          src={currencyIcon.src}
          width={30}
          height={30}
          alt={currencyIcon.alt}
          // Info: (20240206 - Julian) If the image fails to load, use the default currency icon
          onError={e => (e.currentTarget.src = DEFAULT_CURRENCY_ICON)}
        />
        <p className="text-sm font-semibold lg:text-xl">{currencyName}</p>
      </Link>
      {/* Info: (20230907 - Julian) Risk */}
      <div className="flex items-center space-x-2 px-2">
        {/* Info: (20230907 - Julian) The circle svg */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill={riskColor} />
        </svg>
        <p className="text-sm">{riskText}</p>
      </div>
    </div>
  );
};

export default CurrencyItem;
