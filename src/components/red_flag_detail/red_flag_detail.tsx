// Red Flag Detail Component

import Image from 'next/image';
import Link from 'next/link';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IRedFlagDetail} from '../../interfaces/red_flag';
import {getChainIcon, timestampToString, truncateText} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IRedFlagDetailProps {
  redFlagData: IRedFlagDetail;
}

const RedFlagDetail = ({redFlagData}: IRedFlagDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, unit, redFlagType, interactedAddresses, createdTimestamp, totalAmount} =
    redFlagData;

  const chainIcon = getChainIcon(chainId);

  const displayInteractedAddresses = interactedAddresses
    ? interactedAddresses.map((address, index) => {
        const addressLink = getDynamicUrl(address.chainId, `${address.id}`).ADDRESS;
        return (
          <Link href={addressLink} key={index} title={address.id}>
            <BoltButton className="px-3 py-1" color="blue" style="solid">
              {t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')}{' '}
              {truncateText(address.id, DEFAULT_TRUNCATE_LENGTH)}
            </BoltButton>
          </Link>
        );
      })
    : [];

  const {date, time} = createdTimestamp
    ? timestampToString(createdTimestamp)
    : {date: null, time: null};
  const createdTime = createdTimestamp ? `${date} ${time}` : null;

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231110 - Julian) Red Flag Type */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.RED_FLAG_TYPE')}</p>
          <Tooltip>{t('RED_FLAG_ADDRESS_PAGE.RED_FLAG_TYPE_TOOLTIP')}</Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/icons/red_flag.svg" alt="red_flag_icon" width={24} height={24} />
          <p>{t(redFlagType)}</p>
        </div>
      </div>

      {/* Info: (20231110 - Julian) Flagging Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.FLAGGING_TIME')}</p>
          <Tooltip>{t('RED_FLAG_ADDRESS_PAGE.FLAGGING_TIME_TOOLTIP')}</Tooltip>
        </div>

        {/* Info: if the createdTimestamp is null, show the animation */}
        {createdTimestamp ? (
          <div className="flex items-center gap-2">
            <p>{createdTime}</p>
          </div>
        ) : (
          <div
            role="status"
            className="animate-pulse space-y-8 md:flex md:items-center md:space-x-8 md:space-y-0 rtl:space-x-reverse"
          >
            <div className="w-full">
              <div className="my-2 h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>

      {/* Info: (20231110 - Julian) Interacted with */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:min-w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.INTERACTED_WITH')}</p>
          <Tooltip>{t('RED_FLAG_ADDRESS_PAGE.INTERACTED_WITH_TOOLTIP')}</Tooltip>
        </div>
        <div className="flex flex-wrap items-center gap-3">{displayInteractedAddresses}</div>
      </div>
      {/* Info: (20231110 - Julian) Total Amount */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.TOTAL_AMOUNT')}</p>
          <Tooltip>{t('RED_FLAG_ADDRESS_PAGE.TOTAL_AMOUNT_TOOLTIP')}</Tooltip>
        </div>
        <div className="flex items-center space-x-2">
          <Image src={chainIcon.src} alt={chainIcon.alt} width={24} height={24} />
          <p>
            {totalAmount} {unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedFlagDetail;
