import Link from 'next/link';
import Image from 'next/image';
import {BFAURL, getDynamicUrl} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {getChainIcon} from '../../lib/common';
import {IInteractionItem} from '../../interfaces/interaction_item';

interface IInteractionItemProps {
  interactedData: IInteractionItem;
}

const InteractionItem = ({interactedData}: IInteractionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, type, chainId, transactionIds, publicTag} = interactedData;

  const chainIcon = getChainIcon(chainId);
  const itemLink = getDynamicUrl(`${chainId}`, `${id}`);

  const displayPublicTag = (
    <div className="whitespace-nowrap rounded border-violet bg-violet px-4 py-2 text-sm lg:text-base">
      {t(publicTag[0])}
    </div>
  );

  const displayIds =
    type === 'address' ? (
      <Link href={itemLink.ADDRESS} className="flex flex-1 items-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
        <p className="text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
          <span className="text-primaryBlue"> {id}</span>
        </p>
      </Link>
    ) : (
      <Link href={itemLink.CONTRACT} className="flex flex-1 items-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
        <p className="text-xl">
          {t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')}
          <span className="text-primaryBlue"> {id}</span>
        </p>
      </Link>
    );

  return (
    <div className="flex h-60px w-full items-center space-x-4 border-b border-darkPurple4 p-2">
      {/* Info: (20231108 - Julian) Public Tag */}
      {displayPublicTag}
      {/* Info: (20231108 - Julian) Address/Contract ID */}
      {displayIds}
      <div className="hidden items-center lg:flex">
        <p className="text-sm">
          <Link href={BFAURL.COMING_SOON} className="text-primaryBlue underline underline-offset-2">
            {transactionIds.length}
          </Link>{' '}
          {t('COMMON.TRANSACTIONS')}
        </p>
      </div>
    </div>
  );
};

export default InteractionItem;