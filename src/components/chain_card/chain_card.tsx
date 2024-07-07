import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {DEFAULT_CHAIN_ICON} from '@/constants/config';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {IChainDetail} from '@/interfaces/chain';
import {getChainIcon, withCommas} from '@/lib/common';

interface IChainCardProps {
  chainData: IChainDetail;
}

const ChainsCard = ({chainData}: IChainCardProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, chainName, blocks, transactions} = chainData;

  const chainIcon = getChainIcon(chainId);

  return (
    <>
      <Link
        href={`${BFAURL.CHAINS}/${chainId}`}
        className="flex w-250px flex-col space-y-3 rounded-xl border border-transparent bg-darkPurple p-4 shadow-xl transition-all duration-150 ease-in-out hover:border-primaryBlue hover:bg-purpleLinear"
      >
        <div className="flex flex-1 items-center space-x-4">
          <Image
            src={chainIcon.src}
            width={60}
            height={60}
            alt={chainIcon.alt}
            onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
          />
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
