import Image from 'next/image';
import Link from 'next/link';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IRedFlagDetail} from '../../interfaces/red_flag';
import {timestampToString, truncateText} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IRedFlagDetailProps {
  redFlagData: IRedFlagDetail;
}

const RedFlagDetail = ({redFlagData}: IRedFlagDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    chainId,
    chainIcon,
    unit,
    redFlagType,
    interactedAddresses,
    createdTimestamp,
    totalAmount,
  } = redFlagData;

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

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231110 - Julian) Red Flag Type */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.RED_FLAG_TYPE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
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
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <p>{timestampToString(createdTimestamp).date}</p>
          <p>{timestampToString(createdTimestamp).time}</p>
        </div>
      </div>
      {/* Info: (20231110 - Julian) Interacted with */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center text-sm font-bold text-lilac lg:min-w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.INTERACTED_WITH')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">{displayInteractedAddresses}</div>
      </div>
      {/* Info: (20231110 - Julian) Total Amount */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('RED_FLAG_ADDRESS_PAGE.TOTAL_AMOUNT')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Image src={chainIcon} alt={`${chainId}_icon`} width={24} height={24} />
          <p>
            {totalAmount} {unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedFlagDetail;
