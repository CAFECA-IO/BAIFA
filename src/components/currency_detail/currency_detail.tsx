import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {BFAURL} from '@/constants/url';
import {ICurrencyDetailString} from '@/interfaces/currency';
import {TranslateFunction} from '@/interfaces/locale';
import {roundToDecimal, withCommas} from '@/lib/common';
import Tooltip from '@/components/tooltip/tooltip';
import Skeleton from '@/components/skeleton/skeleton';

interface ICurrencyDetailProps {
  currencyData: ICurrencyDetailString;
  isLoading: boolean;
}

const CurrencyDetail = ({currencyData, isLoading}: ICurrencyDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    price,
    volumeIn24h,
    totalAmount,
    unit,
    holderCount,
    totalTransfers,
    flaggingCount,
    riskLevel,
  } = currencyData;

  // Info: (20240222 - Liz) riskLevel 有三種值 Low, Normal, High 要轉換成對應的顏色和文字
  const riskLevelMappings: {[key: string]: {riskColor: string; riskText: string}} = {
    'High': {riskColor: '#FC8181', riskText: t('COMMON.RISK_HIGH')},
    'Normal': {riskColor: '#FFA600', riskText: t('COMMON.RISK_MEDIUM')},
    'Low': {riskColor: '#3DD08C', riskText: t('COMMON.RISK_LOW')},
  };

  // Info: (20240222 - Liz) 如果 riskLevel 從後端傳來的值不是 'High', 'Normal', 'Low' 就預設為 'High'
  const {riskColor, riskText} = riskLevelMappings[riskLevel] ?? riskLevelMappings['High'];

  const displayedPrice = !isLoading ? (
    `$ ${roundToDecimal(price, 2)}`
  ) : (
    <Skeleton width={100} height={20} />
  );

  const displayedVolumeIn24h = !isLoading ? (
    `$ ${withCommas(volumeIn24h)}`
  ) : (
    <Skeleton width={100} height={20} />
  );

  const displayedTotalAmount = !isLoading ? (
    <p>
      {totalAmount} {unit}
    </p>
  ) : (
    <Skeleton width={100} height={20} />
  );

  const displayedHolders = !isLoading ? (
    <p>{withCommas(holderCount)}</p>
  ) : (
    <Skeleton width={100} height={20} />
  );

  const displayedTotalTransfers = !isLoading ? (
    <p>{withCommas(totalTransfers)}</p>
  ) : (
    <Skeleton width={100} height={20} />
  );

  const displayedRedFlag = !isLoading ? (
    <div className="flex items-center space-x-6">
      <p className="text-base">
        <Link
          href={`${BFAURL.CURRENCIES}/${currencyData.currencyId}/red-flag`}
          className="mr-2 text-primaryBlue underline underline-offset-2"
        >
          {withCommas(flaggingCount)}
        </Link>
        {t('COMMON.TIMES')}
      </p>
      <div className="flex items-center space-x-2 px-2">
        {/* Info: (20231101 - Julian) The circle svg */}
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
  ) : (
    <div className="flex items-center space-x-6">
      <Skeleton width={100} height={20} />
      <div className="flex items-center space-x-2">
        <Skeleton width={20} height={20} rounded />
        <Skeleton width={100} height={20} />
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231101 - Julian) Price */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.PRICE')}</p>
        </div>
        {displayedPrice}
      </div>
      {/* Info: (20231101 - Julian) Volume in 24 H */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.VOLUME_IN_24H')}</p>
        </div>
        {displayedVolumeIn24h}
      </div>
      {/* Info: (20231101 - Julian) Total Amount */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.TOTAL_AMOUNT')}</p>
        </div>
        {displayedTotalAmount}
      </div>
      {/* Info: (20231101 - Julian) Holders */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.HOLDERS')}</p>
          <Tooltip>{t('CURRENCY_DETAIL_PAGE.HOLDERS_TOOLTIP')}</Tooltip>
        </div>
        {displayedHolders}
      </div>
      {/* Info: (20231101 - Julian) Total Transfers */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.TOTAL_TRANSFERS')}</p>
          <Tooltip>{t('CURRENCY_DETAIL_PAGE.TOTAL_TRANSFERS_TOOLTIP')}</Tooltip>
        </div>
        {displayedTotalTransfers}
      </div>
      {/* Info: (20231101 - Julian) Red Flag */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.RED_FLAG')}</p>
          <Tooltip>{t('CURRENCY_DETAIL_PAGE.RED_FLAG_TOOLTIP')}</Tooltip>
        </div>
        {displayedRedFlag}
      </div>
    </div>
  );
};

export default CurrencyDetail;
