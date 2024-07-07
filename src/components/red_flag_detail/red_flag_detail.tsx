// Red Flag Detail Component

import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {getDynamicUrl} from '@/constants/url';
import {DEFAULT_TRUNCATE_LENGTH, redFlagTypeI18nObj} from '@/constants/config';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {TranslateFunction} from '@/interfaces/locale';
import {IMenuOptions, IRedFlagDetail} from '@/interfaces/red_flag';
import Tooltip from '@/components/tooltip/tooltip';
import BoltButton from '@/components/bolt_button/bolt_button';
import {getChainIcon, timestampToString, truncateText} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';

interface IRedFlagDetailProps {
  redFlagData: IRedFlagDetail;
}

const RedFlagDetail = ({redFlagData}: IRedFlagDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, unit, redFlagType, interactedAddresses, createdTimestamp, totalAmount} =
    redFlagData;

  // Info: (20240322 - Julian) Get menu options from API
  const {data: menuOptions} = useAPIResponse<IMenuOptions>(`${APIURL.RED_FLAGS}/menu_options`, {
    method: HttpMethod.GET,
  });
  const flaggingMeaning = menuOptions?.redFlagTypeCodeMeaningObj ?? {};

  const redFlagTypeMeaning = flaggingMeaning[redFlagType] ?? redFlagType;
  const redFlagI18n = redFlagTypeI18nObj[redFlagTypeMeaning] ?? redFlagTypeMeaning;

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
          <p>{t(redFlagI18n)}</p>
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
            className="animate-pulse space-y-8 rtl:space-x-reverse md:flex md:items-center md:space-x-8 md:space-y-0"
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
