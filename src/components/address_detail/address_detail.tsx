import {useState, useEffect} from 'react';
import Link from 'next/link';
import BoltButton from '../bolt_button/bolt_button';
import Tooltip from '../tooltip/tooltip';
import {timestampToString, getTimeString, truncateText} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IAddress} from '../../interfaces/address';
import {BFAURL, getDynamicUrl} from '../../constants/url';
import {RiskLevel} from '../../constants/risk_level';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IAddressDetailProps {
  addressData: IAddress;
}

const AddressDetail = ({addressData}: IAddressDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    id,
    address,
    chainId,
    createdTimestamp,
    latestActiveTime,
    relatedAddresses,
    interactedAddressCount,
    interactedContactCount,
    flaggingCount,
    riskLevel,
    balance,
    totalSent,
    totalReceived,
  } = addressData;
  const [sinceTime, setSinceTime] = useState(0);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);

    // Info: (20231017 - Julian) 算出 latestActiveTime 距離現在過了多少時間
    timer = setTimeout(() => {
      const now = Math.ceil(Date.now() / 1000);
      const timeSpan = now - latestActiveTime;
      setSinceTime(timeSpan);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sinceTime]);

  const dynamicUrl = getDynamicUrl(`${chainId}`, `${id}`);

  const displaySignUpTime = (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
      <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
    </div>
  );

  const displayLatestActiveTime = (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(latestActiveTime).date}</p>
      <div className="mr-2 flex items-center space-x-2">
        <p>{getTimeString(sinceTime)}</p>
        <p>{t('COMMON.AGO')}</p>
      </div>
    </div>
  );

  const displayRelatedAddress = relatedAddresses ? (
    relatedAddresses.map((address, index) => {
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
  ) : (
    <></>
  );

  const displayInteractedWith = (
    <div className="flex items-center space-x-2 text-base">
      <div className="flex items-center whitespace-nowrap">
        {interactedAddressCount > 0 ? (
          <Link href={`${dynamicUrl.INTERACTION}?type=address`}>
            <span className="mr-2 text-primaryBlue underline underline-offset-2">
              {interactedAddressCount}
            </span>
          </Link>
        ) : (
          <span className="mr-2 text-primaryBlue">{interactedAddressCount}</span>
        )}
        <p>{t('COMMON.ADDRESSES')} /</p>
      </div>
      <div className="flex items-center whitespace-nowrap">
        {interactedContactCount > 0 ? (
          <Link href={`${dynamicUrl.INTERACTION}?type=contract`}>
            <span className="mr-2 text-primaryBlue underline underline-offset-2">
              {interactedContactCount}
            </span>
          </Link>
        ) : (
          <span className="mr-2 text-primaryBlue">{interactedContactCount}</span>
        )}
        <p>{t('COMMON.CONTRACTS')}</p>
      </div>
    </div>
  );

  const riskColor =
    riskLevel === RiskLevel.HIGH_RISK
      ? '#FC8181'
      : riskLevel === RiskLevel.MEDIUM_RISK
      ? '#FFA600'
      : '#3DD08C';
  const riskText =
    riskLevel === RiskLevel.HIGH_RISK
      ? t('COMMON.RISK_HIGH')
      : riskLevel === RiskLevel.MEDIUM_RISK
      ? t('COMMON.RISK_MEDIUM')
      : t('COMMON.RISK_LOW');

  const flaggingLink =
    flaggingCount > 0 ? (
      <Link href={dynamicUrl.RED_FLAG_OF_ADDRESS}>
        <span className="mr-2 text-primaryBlue underline underline-offset-2">{flaggingCount}</span>
      </Link>
    ) : (
      <span className="mr-2 text-primaryBlue">{flaggingCount}</span>
    );

  const displayRedFlag = (
    <div className="flex items-center space-x-4">
      {/* Info: (20231017 - Julian) Flagging */}
      <div className="flex items-center whitespace-nowrap">
        {flaggingLink} {t('COMMON.TIMES')}
      </div>
      {/* Info: (20231017 - Julian) Risk */}
      <div className="flex items-center space-x-2 px-2">
        {/* Info: (20231017 - Julian) The circle svg */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill={riskColor} />
        </svg>
        <p className="text-sm">{riskText}</p>
      </div>
    </div>
  );

  // ToDo: (20231018 - Julian) log ins
  const contentLoginOnly = (
    <Link href={BFAURL.COMING_SOON}>
      <p className="text-primaryBlue underline underline-offset-2">{t('COMMON.LOG_IN_ONLY')}</p>
    </Link>
  );

  // ToDo: (20231017 - Julian) display balance
  const displayBalance = balance ? <></> : contentLoginOnly;
  const displayTotalSent = totalSent ? <></> : contentLoginOnly;
  const displayTotalReceived = totalReceived ? <></> : contentLoginOnly;

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231017 - Julian) Address Level */}
      <div className="flex flex-col space-y-2 px-3 py-4 text-sm lg:flex-row lg:items-center lg:space-y-0 lg:text-base">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <p className="break-all">{address}</p>
      </div>
      {/* Info: (20231017 - Julian) Sign Up time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.SIGN_UP_TIME')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displaySignUpTime}
      </div>
      {/* Info: (20231017 - Julian) Latest Active Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.LATEST_ACTIVE_TIME')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayLatestActiveTime}
      </div>
      {/* Deprecated: (20240201 - Julian) Related Address */}
      {/* <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.RELATED_ADDRESS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="flex flex-wrap items-center gap-3">{displayRelatedAddress}</div>
      </div> */}
      {/* Info: (20231017 - Julian) Interacted With */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.INTERACTED_WITH')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayInteractedWith}
      </div>
      {/* Info: (20231017 - Julian) Red Flag */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.RED_FLAG')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayRedFlag}
      </div>
      {/* Info: (20231017 - Julian) Balance */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.BALANCE')}
        </p>
        {displayBalance}
      </div>
      {/* Info: (20231017 - Julian) Total Sent */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.TOTAL_SENT')}
        </p>
        {displayTotalSent}
      </div>
      {/* Info: (20231017 - Julian) Total Received */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.TOTAL_RECEIVED')}
        </p>
        {displayTotalReceived}
      </div>
    </div>
  );
};

export default AddressDetail;
