import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {BFAURL, getDynamicUrl} from '../../constants/url';
import {timestampToString, truncateText} from '../../lib/common';
import {IEvidenceDetail} from '../../interfaces/evidence';
import {EvidenceState, DefaultEvidenceState} from '../../constants/state';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';
import Skeleton from '../skeleton/skeleton';

interface IEvidenceDetailProps {
  evidenceData: IEvidenceDetail;
  isLoading: boolean;
}

const EvidenceDetail = ({evidenceData, isLoading}: IEvidenceDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {evidenceAddress, chainId, state, creatorAddressId, createdTimestamp} = evidenceData;

  const addressLink = getDynamicUrl(chainId, `${creatorAddressId}`).ADDRESS;
  const reportLink = `/app/chains/${chainId}/evidence/${evidenceData.id}/all-reports`;

  const displayHash = !isLoading ? (
    <p className="max-w-550px break-all text-sm lg:text-base">{evidenceAddress}</p>
  ) : (
    // Info: (20240215 - Julian) Loading Animation
    <Skeleton width={200} height={24} />
  );

  // Info: (20230205 - Julian) 取得 Evidence State 的文字內容，若無對應的文字內容，則使用預設值
  const stateContent = EvidenceState[state] ?? DefaultEvidenceState;
  const displayState = !isLoading ? (
    <div className="flex items-center text-hoverWhite">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
      >
        <circle cx="7.5" cy="8.48853" r="7.5" fill={stateContent.color} />
      </svg>
      <p className="ml-2 text-sm text-hoverWhite lg:text-base">{t(stateContent.text)}</p>
    </div>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <div className="flex items-center space-x-1">
      <Skeleton height={24} width={24} rounded />
      <Skeleton height={24} width={100} />
    </div>
  );

  const displayCreator = !isLoading ? (
    <Link href={addressLink} title={creatorAddressId}>
      <BoltButton className="px-3 py-1" color="blue" style="solid">
        {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}{' '}
        {truncateText(creatorAddressId, DEFAULT_TRUNCATE_LENGTH)}
      </BoltButton>
    </Link>
  ) : (
    <Skeleton width={100} height={24} />
  );

  const displayTime = !isLoading ? (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
      <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
    </div> // Info: (20240206 - Julian) Loading Animation
  ) : (
    <div className="flex items-center space-x-3">
      <Skeleton height={24} width={100} />
      <Skeleton height={24} width={100} />
    </div>
  );

  const displayContent = !isLoading ? (
    state === 'public' ? (
      <div className="w-full">
        {/* Info: (20240202 - Julian) Reports */}
        <iframe src={reportLink} className="h-200px w-full lg:h-600px" />
      </div>
    ) : (
      /* ToDo: (20230911 - Julian) log in button */
      <Link href={BFAURL.COMING_SOON}>
        <p className="text-primaryBlue underline underline-offset-2">{t('COMMON.LOG_IN_ONLY')}</p>
      </Link>
    )
  ) : (
    <Skeleton height={24} width={200} />
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231107 - Julian) Evidence Hash */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.EVIDENCE_ADDRESS')}</p>
          <Tooltip>{t('EVIDENCE_DETAIL_PAGE.EVIDENCE_ADDRESS_TOOLTIP')}</Tooltip>
        </div>
        {displayHash}
      </div>
      {/* Info: (20231107 - Julian) State */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.STATE')}</p>
          <Tooltip>{t('EVIDENCE_DETAIL_PAGE.STATE_TOOLTIP')}</Tooltip>
        </div>
        {displayState}
      </div>
      {/* Info: (20231107 - Julian) Creator */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.CREATOR')}</p>
          <Tooltip>{t('EVIDENCE_DETAIL_PAGE.CREATOR_TOOLTIP')}</Tooltip>
        </div>
        {displayCreator}
      </div>
      {/* Info: (20231107 - Julian) Creating Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.CREATING_TIME')}</p>
          <Tooltip>{t('EVIDENCE_DETAIL_PAGE.CREATING_TIME_TOOLTIP')}</Tooltip>
        </div>
        {displayTime}
      </div>
      {/* Info: (20231107 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-start lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.CONTENT')}</p>
          <Tooltip>{t('EVIDENCE_DETAIL_PAGE.CONTENT_TOOLTIP')}</Tooltip>
        </div>
        {displayContent}
      </div>
    </div>
  );
};

export default EvidenceDetail;
