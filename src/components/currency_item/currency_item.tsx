import Image from 'next/image';
import Link from 'next/link';
import {getChainIcon} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {RiskLevel} from '../../constants/risk_level';

interface ICurrencyItemProps {
  currencyId: string;
  currencyName: string;
  rank: number;
  riskLevel: string;
}

const CurrencyItem = ({currencyId, currencyName, rank, riskLevel}: ICurrencyItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const chainIcon = getChainIcon(currencyId);

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
    <div className="flex w-full items-center border-b border-darkPurple4 p-5 font-inter">
      {/* Info: (20230927 - Julian) Rank */}
      <div className="w-50px text-xl font-semibold">#{rank}</div>
      {/* Info: (20230927 - Julian) Currency Name & Icon */}
      <Link href={`/app/currencies/${currencyId}`} className="flex flex-1 items-center space-x-2">
        <Image src={chainIcon.src} width={30} height={30} alt={chainIcon.alt} />
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
