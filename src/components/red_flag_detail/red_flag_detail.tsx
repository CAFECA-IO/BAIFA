import Image from 'next/image';
import Link from 'next/link';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IRedFlag} from '../../interfaces/red_flag';
import {getChainIcon, getUnit, timestampToString} from '../../lib/common';
import {dummyAddressData} from '../../interfaces/address';
import {getDynamicUrl} from '../../constants/url';

interface IRedFlagDetailProps {
  redFlagData: IRedFlag;
}

const RedFlagDetail = ({redFlagData}: IRedFlagDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, addressHash, redFlagType, interactedAddressIds, flaggingTimestamp, totalAmount} =
    redFlagData;

  const chainIcon = getChainIcon(chainId);
  const unit = getUnit(chainId);

  const displayInteractedAddresses = interactedAddressIds.map((id, index) => {
    const targetChainId = dummyAddressData.find(address => address.id === id)?.chainId ?? '';
    const addressLink = getDynamicUrl(targetChainId, `${id}`).ADDRESS;
    return (
      <Link href={addressLink} key={index}>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')} {id}
        </BoltButton>
      </Link>
    );
  });

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231110 - Julian) Address Hash */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>Address</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {addressHash}
      </div>
      {/* Info: (20231110 - Julian) Red Flag Type */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>Red Flag Type</p>
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
          <p>Flagging Time</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <p>{timestampToString(flaggingTimestamp).date}</p>
          <p>{timestampToString(flaggingTimestamp).time}</p>
        </div>
      </div>
      {/* Info: (20231110 - Julian) Interacted with */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="lg:min-w-200px flex items-center text-sm font-bold text-lilac lg:text-base">
          <p>Interacted with</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">{displayInteractedAddresses}</div>
      </div>
      {/* Info: (20231110 - Julian) Total Amount */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>Total Amount</p>
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
