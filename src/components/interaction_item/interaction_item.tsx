import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import {DEFAULT_CHAIN_ICON} from '@/constants/config';
import {BFAURL, getDynamicUrl} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {IInteraction} from '@/interfaces/interaction_item';
import {getChainIcon} from '@/lib/common';

interface IInteractionItemProps {
  originalAddressId: string;
  interactedData: IInteraction;
}

const InteractionItem = ({originalAddressId, interactedData}: IInteractionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, type, chainId, transactionCount, redFlagCount, publicTag} = interactedData;

  const chainIcon = getChainIcon(chainId);
  const itemLink = getDynamicUrl(`${chainId}`, `${id}`);

  const transactionUrl = `${getDynamicUrl(`${chainId}`, `${originalAddressId}`).TRANSACTION_LIST}`;
  const transactionQuery = `?addressId=${originalAddressId}&addressId=${id}`;
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

  const redFlagCountText =
    redFlagCount > 0 ? (
      <p>
        <Link href={BFAURL.RED_FLAG} className="text-primaryBlue underline underline-offset-2">
          {redFlagCount}
        </Link>{' '}
        {t('COMMON.RED_FLAGS_OF')}
      </p>
    ) : null;

  return (
    <div className="flex h-60px w-full items-center space-x-2 border-b border-darkPurple4 p-2 lg:space-x-4">
      {/* Info: (20231108 - Julian) Public Tag */}
      {displayPublicTag}
      {/* Info: (20231108 - Julian) Address/Contract ID */}
      {displayIds}
      <div className="hidden w-240px items-center justify-end space-x-2 whitespace-nowrap text-right text-sm lg:inline-flex">
        {redFlagCountText}
        <p>
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
