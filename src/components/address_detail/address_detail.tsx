import {useState, useEffect} from 'react';
import Link from 'next/link';
import BoltButton from '../bolt_button/bolt_button';
import {timestampToString, getTimeString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IAddress} from '../../interfaces/address';
import {BFAURL} from '../../constants/url';
import {RiskLevel} from '../../constants/risk_level';
import {FiLock} from 'react-icons/fi';

interface IAddressDetailProps {
  addressData: IAddress;
}

const AddressDetail = (addressData: IAddressDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    addressId,
    signUpTime,
    lastestActiveTime,
    relatedAddressIds,
    interactedAddressIds,
    interactedContactIds,
    flagging,
    riskLevel,
    balance,
    totalSent,
    totalReceived,
  } = addressData.addressData;
  const [sinceTime, setSinceTime] = useState(0);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    // Info: (20231017 - Julian) 算出 lastestActiveTime 距離現在過了多少時間
    const now = Math.ceil(Date.now() / 1000);
    const timeSpan = now - lastestActiveTime;
    setSinceTime(timeSpan);

    return () => clearTimeout(timer);
  }, [sinceTime]);

  const displaySignUpTime = (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(signUpTime).date}</p>
      <p className="mr-2">{timestampToString(signUpTime).time}</p>
    </div>
  );

  const displayLatestActiveTime = (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">
        {getTimeString(sinceTime)} {t('COMMON.AGO')}
      </p>
    </div>
  );

  const displayRelatedAddress = relatedAddressIds.map((id, index) => {
    return (
      <Link href={`${BFAURL.ADDRESS}/${id}`} key={index}>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')} {id}
        </BoltButton>
      </Link>
    );
  });

  const displayInteractedWith = (
    <div className="flex items-center space-x-2 text-base">
      <p>
        <span className="mr-2 text-primaryBlue">{interactedAddressIds.length}</span>
        {t('COMMON.ADDRESSES')}
      </p>
      <p>/</p>
      <p>
        <span className="mr-2 text-primaryBlue">{interactedContactIds.length}</span>
        {t('COMMON.CONTRACTS')}
      </p>
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

  const displayRedFlag = (
    <div className="flex items-center space-x-4">
      <span className="mr-2 text-primaryBlue">{flagging?.length}</span> {t('COMMON.TIMES')}
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

  // Info: (20231017 - Julian) If content is encrypted, display this
  const encryptedContent = (
    <div className="flex items-center space-x-4">
      <FiLock />
      <p>{t('COMMON.CONTENT_ENCRYPTED')}</p>
    </div>
  );

  // ToDo: (20231017 - Julian) display balance
  const displayBalance = balance ? <></> : encryptedContent;
  const displayTotalSent = totalSent ? <></> : encryptedContent;
  const displayTotalReceived = totalReceived ? <></> : encryptedContent;

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231017 - Julian) Address Level */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')}
        </p>
        {addressId}
      </div>
      {/* Info: (20231017 - Julian) Sign Up time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.SIGN_UP_TIME')}
        </p>
        {displaySignUpTime}
      </div>
      {/* Info: (20231017 - Julian) Latest Active Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.LATEST_ACTIVE_TIME')}
        </p>
        {displayLatestActiveTime}
      </div>
      {/* Info: (20231017 - Julian) Related Address */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.RELATED_ADDRESS')}
        </p>
        <div className="flex flex-wrap items-center space-x-3">{displayRelatedAddress}</div>
      </div>
      {/* Info: (20231017 - Julian) Interacted With */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.INTERACTED_WITH')}
        </p>
        {displayInteractedWith}
      </div>
      {/* Info: (20231017 - Julian) Red Flag */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.RED_FLAG')}
        </p>
        {displayRedFlag}
      </div>
      {/* Info: (20231017 - Julian) Balance */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.BALANCE')}
        </p>
        {displayBalance}
      </div>
      {/* Info: (20231017 - Julian) Total Sent */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.TOTAL_SENT')}
        </p>
        {displayTotalSent}
      </div>
      {/* Info: (20231017 - Julian) Total Received */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-170px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.TOTAL_RECEIVED')}
        </p>
        {displayTotalReceived}
      </div>
    </div>
  );
};

export default AddressDetail;
