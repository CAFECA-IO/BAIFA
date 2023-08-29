import Image from 'next/image';
import Link from 'next/link';
import {BFAURL} from '../../constants/url';
import {withCommas} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

interface IChainCardProps {
  chainId: string;
  chainName: string;
  icon: string;
  blocks: number;
  transactions: number;
}

const ChainsCard = ({chainId, chainName, icon, blocks, transactions}: IChainCardProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <>
      <Link
        href={`${BFAURL.CHAINS}/${chainId}`}
        className="flex w-250px flex-col space-y-3 bg-darkPurple p-4 shadow-xl"
      >
        <div className="flex flex-1 items-center space-x-4">
          <Image src={icon} width={60} height={60} alt={`${chainName}_icon`} />
          <h2 className="text-xl font-semibold text-hoverWhite">{chainName}</h2>
        </div>
        <div className="flex flex-col space-y-2 text-sm font-normal">
          {/* Info: (20230829 - Julian) Blocks */}
          <div className="flex items-center justify-between">
            <p className="text-lilac">{t('CHAINS_PAGE.BLOCKS')}</p>
            <p className="text-hoverWhite">{withCommas(blocks)}</p>
          </div>
          {/* Info: (20230829 - Julian) Transactions */}
          <div className="flex items-center justify-between">
            <p className="text-lilac">{t('CHAINS_PAGE.TRANSACTIONS')}</p>
            <p className="text-hoverWhite">{withCommas(transactions)}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ChainsCard;
