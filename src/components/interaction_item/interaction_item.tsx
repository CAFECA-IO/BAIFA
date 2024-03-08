import Link from 'next/link';
import Image from 'next/image';
import {getDynamicUrl} from '../../constants/url';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IInteractionItem} from '../../interfaces/interaction_item';
import {getChainIcon} from '../../lib/common';
import {DEFAULT_CHAIN_ICON} from '../../constants/config';

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
    <div className="whitespace-nowrap rounded border-violet bg-violet px-2 py-1 text-xs lg:px-4 lg:py-2 lg:text-base">
      {t(publicTag[0])}
    </div>
  ) : (
    <></>
  );

  const displayIds =
    type === 'address' ? (
      <Link
        href={itemLink.ADDRESS}
        className="inline-flex flex-1 items-center space-x-2 text-primaryBlue"
      >
        {displayIcon}
        <p
          className="w-200px grow overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:w-500px lg:text-xl"
          title={id}
        >
          <span className="text-hoverWhite">{t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')} </span>
          {id}
        </p>
      </Link>
    ) : (
      <Link
        href={itemLink.CONTRACT}
        className="inline-flex flex-1 items-center space-x-2 text-primaryBlue"
      >
        {displayIcon}
        <p
          className="w-200px grow overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:w-500px lg:text-xl"
          title={id}
        >
          <span className="text-hoverWhite">{t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')} </span>
          {id}
        </p>
      </Link>
    );

  return (
    <div className="flex h-60px w-full items-center space-x-2 border-b border-darkPurple4 p-2 lg:space-x-4">
      {/* Info: (20231108 - Julian) Public Tag */}
      {displayPublicTag}
      {/* Info: (20231108 - Julian) Address/Contract ID */}
      {displayIds}
      <div className="hidden items-center lg:inline-flex">
        <p className="w-60px whitespace-nowrap text-right text-sm">
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
