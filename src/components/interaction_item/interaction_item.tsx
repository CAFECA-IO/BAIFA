import Link from 'next/link';
import Image from 'next/image';
import {getDynamicUrl} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IInteractionItem} from '../../interfaces/interaction_item';
import {getChainIcon, truncateText} from '../../lib/common';
import {DEFAULT_CHAIN_ICON, DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IInteractionItemProps {
  orignalAddressId: string;
  interactedData: IInteractionItem;
}

const InteractionItem = ({orignalAddressId, interactedData}: IInteractionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, type, chainId, transactionCount, publicTag} = interactedData;

  const chainIcon = getChainIcon(chainId);
  const itemLink = getDynamicUrl(`${chainId}`, `${id}`);

  const transactionUrl = `${getDynamicUrl(`${chainId}`, `${orignalAddressId}`).TRANSACTION_LIST}`;
  const transactionQuery = `?addressId=${orignalAddressId}&addressId=${id}`;
  const transactionLink = `${transactionUrl}${transactionQuery}`;

  const displayIcon = (
    <Image
      src={chainIcon.src}
      alt={chainIcon.alt}
      width={30}
      height={30}
      onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
    />
  );

  const displayPublicTag = publicTag ? (
    <div className="whitespace-nowrap rounded border-violet bg-violet px-4 py-2 text-sm lg:text-base">
      {t(publicTag[0])}
    </div>
  ) : (
    <></>
  );

  const displayIds =
    type === 'address' ? (
      <Link href={itemLink.ADDRESS} className="flex flex-1 items-center space-x-2">
        {displayIcon}
        <p className="text-sm lg:text-xl" title={id}>
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
          <span className="text-primaryBlue"> {truncateText(id, DEFAULT_TRUNCATE_LENGTH)}</span>
        </p>
      </Link>
    ) : (
      <Link href={itemLink.CONTRACT} className="flex flex-1 items-center space-x-2">
        {displayIcon}
        <p className="text-sm lg:text-xl" title={id}>
          {t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')}
          <span className="text-primaryBlue"> {truncateText(id, DEFAULT_TRUNCATE_LENGTH)}</span>
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
          <Link href={transactionLink} className="text-primaryBlue underline underline-offset-2">
            {transactionCount}
          </Link>{' '}
          {t('COMMON.TRANSACTIONS')}
        </p>
      </div>
    </div>
  );
};

export default InteractionItem;
