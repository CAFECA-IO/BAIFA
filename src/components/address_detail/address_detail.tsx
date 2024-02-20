import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import Tooltip from '../tooltip/tooltip';
import {timestampToString, getTimeString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IAddressBrief} from '../../interfaces/address';
import {BFAURL, getDynamicUrl} from '../../constants/url';
import {RiskLevel} from '../../constants/risk_level';
import Skeleton from '../skeleton/skeleton';
import {
  DEFAULT_INTERACTED_ACCOUNT_COUNT,
  DEFAULT_RED_FLAG_COUNT,
  MILLISECONDS_IN_A_SECOND,
} from '../../constants/config';

interface IAddressDetailProps {
  addressData: IAddressBrief;
  isLoading?: boolean;
}

const AddressDetail = ({addressData, isLoading = true}: IAddressDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    address,
    chainId,
    createdTimestamp,
    latestActiveTime,
    // relatedAddresses, // ToDo: (20240201 - Julian) 可能移除
    interactedAddressCount,
    interactedContactCount,
    flaggingCount,
    riskLevel,
    balance,
    totalSent,
    totalReceived,
  } = addressData;
  const [sinceTime, setSinceTime] = useState(0);
  const [loading, setLoading] = useState(true);

  // Info: 用是否有資料被傳進來作為是否還在載入的依據 (20240220 - Shirley)
  useEffect(() => {
    if (address && address.length > 0) {
      setLoading(false);
    }
  }, [address]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Info: (20231017 - Julian) 算出 latestActiveTime 距離現在過了多少時間
    timerRef.current = setTimeout(() => {
      const now = Math.ceil(Date.now() / MILLISECONDS_IN_A_SECOND);
      const timeSpan = now - latestActiveTime;
      setSinceTime(timeSpan);
    }, MILLISECONDS_IN_A_SECOND);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [latestActiveTime, sinceTime]);

  const dynamicUrl = getDynamicUrl(`${chainId}`, `${address}`);

  const addressToDisplay = address ? address : '-';

  const displayedAddress = loading ? (
    <Skeleton width={250} height={20} />
  ) : (
    <p className="break-all">{addressToDisplay}</p>
  );

  const displaySignUpTime = (
    <div className="flex flex-wrap items-center">
      {loading ? (
        <Skeleton width={250} height={20} />
      ) : createdTimestamp > 0 ? (
        <>
          <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
          <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
        </>
      ) : (
        '-'
      )}
    </div>
  );

  const displayLatestActiveTime = (
    <div className="flex flex-wrap items-center">
      {loading ? (
        <Skeleton width={250} height={20} />
      ) : latestActiveTime > 0 ? (
        <>
          <p className="mr-2">{timestampToString(latestActiveTime).date}</p>
          <div className="mr-2 flex items-center space-x-2">
            <p>{getTimeString(sinceTime)}</p>
            <p>{t('COMMON.AGO')}</p>
          </div>
        </>
      ) : (
        '-'
      )}
    </div>
  );

  /*
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
  */

  const displayInteractedWith = (
    <div className="flex items-center space-x-2 text-base">
      <div className="flex items-center whitespace-nowrap">
        {loading ? (
          <Skeleton width={30} height={20} />
        ) : interactedAddressCount > 0 ? (
          <Link href={`${dynamicUrl.INTERACTION}?type=address`}>
            <span className="mr-2 text-primaryBlue underline underline-offset-2">
              {interactedAddressCount}
            </span>
          </Link>
        ) : (
          <span className="mr-2 text-primaryBlue">{DEFAULT_INTERACTED_ACCOUNT_COUNT}</span>
        )}
        <p>{t('COMMON.ADDRESSES')} /</p>
      </div>
      <div className="flex items-center whitespace-nowrap">
        {loading ? (
          <Skeleton width={30} height={20} />
        ) : interactedContactCount > 0 ? (
          <Link href={`${dynamicUrl.INTERACTION}?type=contract`}>
            <span className="mr-2 text-primaryBlue underline underline-offset-2">
              {interactedContactCount}
            </span>
          </Link>
        ) : (
          <span className="mr-2 text-primaryBlue">{DEFAULT_INTERACTED_ACCOUNT_COUNT}</span>
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
      : riskLevel === RiskLevel.LOW_RISK
      ? t('COMMON.RISK_LOW')
      : '';

  const flaggingLink =
    flaggingCount > 0 ? (
      <Link href={dynamicUrl.RED_FLAG_OF_ADDRESS}>
        <span className="mr-2 text-primaryBlue underline underline-offset-2">{flaggingCount}</span>
      </Link>
    ) : (
      <span className="mr-2 text-primaryBlue">{DEFAULT_RED_FLAG_COUNT}</span>
    );

  const displayRedFlag = loading ? (
    <Skeleton width={250} height={20} />
  ) : (
    <div className="flex items-center space-x-4">
      {/* Info: (20231017 - Julian) Flagging */}
      <div className="flex items-center whitespace-nowrap">
        {flaggingLink} {t('COMMON.TIMES')}
      </div>
      {/* Info: (20231017 - Julian) Risk */}
      <div className="flex items-center space-x-2 px-2">
        {/* Info: (20231017 - Julian) The circle svg */}
        {latestActiveTime && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
          >
            <circle cx="7.5" cy="8.48853" r="7.5" fill={riskColor} />
          </svg>
        )}
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
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.ADDRESS_TOOLTIP')}</Tooltip>
        </div>
        {displayedAddress}
      </div>
      {/* Info: (20231017 - Julian) Sign Up time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.SIGN_UP_TIME')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.SIGN_UP_TIME_TOOLTIP')} </Tooltip>
        </div>
        {displaySignUpTime}
      </div>
      {/* Info: (20231017 - Julian) Latest Active Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.LATEST_ACTIVE_TIME')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.LATEST_ACTIVE_TIME_TOOLTIP')} </Tooltip>
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
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.INTERACTED_WITH_TOOLTIP')} </Tooltip>
        </div>
        {displayInteractedWith}
      </div>
      {/* Info: (20231017 - Julian) Red Flag */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.RED_FLAG')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.RED_FLAG_TOOLTIP')} </Tooltip>
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
