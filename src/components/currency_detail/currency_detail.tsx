import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {ICurrencyDetail} from '../../interfaces/currency';
import {TranslateFunction} from '../../interfaces/locale';
import {roundToDecimal, withCommas} from '../../lib/common';
import {BFAURL} from '../../constants/url';
import {RiskLevel} from '../../constants/risk_level';
import Tooltip from '../tooltip/tooltip';

interface ICurrencyDetailProps {
  currencyData: ICurrencyDetail;
}

const CurrencyDetail = ({currencyData}: ICurrencyDetailProps) => {
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

  const riskColor =
    riskLevel === RiskLevel.HIGH_RISK
      ? '#FC8181'
      : riskLevel === RiskLevel.MEDIUM_RISK
      ? '#FFA600'
      : '#3DD08C';
  const riskText =
    riskLevel === RiskLevel.HIGH_RISK
      ? t('COMMON.RISK_HIGH')
      : riskLevel === RiskLevel.MEDIUM_RISK
      ? t('COMMON.RISK_MEDIUM')
      : t('COMMON.RISK_LOW');

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231101 - Julian) Price */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.PRICE')}</p>
        </div>
        <p>$ {roundToDecimal(price, 2)}</p>
      </div>
      {/* Info: (20231101 - Julian) Volume in 24 H */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.VOLUME_IN_24H')}</p>
        </div>
        <p>$ {withCommas(volumeIn24h)}</p>
      </div>
      {/* Info: (20231101 - Julian) Total Amount */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.TOTAL_AMOUNT')}</p>
        </div>
        <p>
          {withCommas(totalAmount)} {unit}
        </p>
      </div>
      {/* Info: (20231101 - Julian) Holders */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.HOLDERS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <p>{holderCount}</p>
      </div>
      {/* Info: (20231101 - Julian) Total Transfers */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.TTOTAL_TRANSFERS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <p>{withCommas(totalTransfers)}</p>
      </div>
      {/* Info: (20231101 - Julian) Red Flag */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CURRENCY_DETAIL_PAGE.RED_FLAG')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
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
      </div>
    </div>
  );
};

export default CurrencyDetail;
