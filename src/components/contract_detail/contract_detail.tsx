import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IContractDetail} from '../../interfaces/contract';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {getDynamicUrl} from '../../constants/url';
import {timestampToString, truncateText} from '../../lib/common';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IContractDetailDetailProps {
  contractData: IContractDetail;
}

const ContractDetail = ({contractData}: IContractDetailDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {contractAddress, chainId, creatorAddressId, createdTimestamp, sourceCode} = contractData;

  const addressLink = getDynamicUrl(chainId, `${creatorAddressId}`).ADDRESS;

  const displayContractAddress = contractAddress ? (
    <p className="break-all text-sm lg:text-base">{contractAddress}</p>
  ) : (
    // Info: (20240215 - Julian) Loading Animation
    <div className="h-20px w-100px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  );

  const displayCreator = creatorAddressId ? (
    <Link href={addressLink} title={creatorAddressId}>
      <BoltButton className="px-3 py-1" color="blue" style="solid">
        {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}{' '}
        {truncateText(creatorAddressId, DEFAULT_TRUNCATE_LENGTH)}
      </BoltButton>
    </Link>
  ) : (
    // Info: (20240215 - Julian) Loading Animation
    <div className="h-20px w-100px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  );

  const displayTime = createdTimestamp ? (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
      <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
    </div>
  ) : (
    // Info: (20240215 - Julian) Loading Animation
    <div className="flex items-center space-x-3">
      <div className="h-20px w-100px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-20px w-100px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );

  const displaySourceCode = sourceCode ? (
    <pre className="max-h-200px flex-1 overflow-scroll bg-darkPurple3 p-4 text-sm">
      <code>{sourceCode}</code>
    </pre>
  ) : (
    // Info: (20240215 - Julian) Loading Animation
    <div className="h-50px w-200px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20240215 - Julian) Contract Address */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.CONTRACT_ADDRESS')}</p>
          <Tooltip>{t('CONTRACT_DETAIL_PAGE.CONTRACT_ADDRESS_TOOLTIP')}</Tooltip>
        </div>
        {displayContractAddress}
      </div>
      {/* Info: (20240215 - Julian) Creator */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.CREATOR')}</p>
          <Tooltip>{t('CONTRACT_DETAIL_PAGE.CREATOR_TOOLTIP')}</Tooltip>
        </div>
        {displayCreator}
      </div>
      {/* Info: (20240215 - Julian) Creating Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.CREATING_TIME')}</p>
          <Tooltip>{t('CONTRACT_DETAIL_PAGE.CREATING_TIME_TOOLTIP')}</Tooltip>
        </div>
        {displayTime}
      </div>
      {/* Info: (20240215 - Julian) Source Code */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-start lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.SOURCE_CODE')}</p>
          <Tooltip>{t('CONTRACT_DETAIL_PAGE.SOURCE_CODE_TOOLTIP')}</Tooltip>
        </div>
        {displaySourceCode}
      </div>
    </div>
  );
};

export default ContractDetail;
