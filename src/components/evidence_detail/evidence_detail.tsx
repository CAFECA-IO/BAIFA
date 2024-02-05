import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {getDynamicUrl} from '../../constants/url';
import {timestampToString, truncateText} from '../../lib/common';
import {IEvidenceDetail} from '../../interfaces/evidence';
import {EvidenceState, DefaultEvidenceState} from '../../constants/state';
import {BFA_EVIDENCE_CONTENT_URL, DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IEvidenceDetailProps {
  evidenceData: IEvidenceDetail;
}

const EvidenceDetail = ({evidenceData}: IEvidenceDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {evidenceAddress, chainId, state, creatorAddressId, createdTimestamp} = evidenceData;

  const addressLink = getDynamicUrl(chainId, `${creatorAddressId}`).ADDRESS;

  // Info: (20230205 - Julian) 取得 Evidence State 的文字內容，若無對應的文字內容，則使用預設值
  const stateContent = EvidenceState[state] ?? DefaultEvidenceState;
  const displayState = (
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
  );
  /*     state === 'Active' ? (
      <div className="flex items-center text-hoverWhite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill="#3DD08C" />
        </svg>
        <p className="ml-2 text-sm text-hoverWhite lg:text-base">
          {t('EVIDENCE_DETAIL_PAGE.STATE_ACTIVE')}
        </p>
      </div>
    ) : (
      <div className="flex items-center text-hoverWhite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill="#FC8181" />
        </svg>
        <p className="ml-2 text-sm text-hoverWhite lg:text-base">
          {t('EVIDENCE_DETAIL_PAGE.STATE_INACTIVE')}
        </p>
      </div>
    ); */

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231107 - Julian) Evidence Hash */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.EVIDENCE_ADDRESS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <p className="max-w-550px break-all text-sm lg:text-base">{evidenceAddress}</p>
      </div>
      {/* Info: (20231107 - Julian) State */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.STATE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayState}
      </div>
      {/* Info: (20231107 - Julian) Creator */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.CREATOR')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <Link href={addressLink} title={creatorAddressId}>
          <BoltButton className="px-3 py-1" color="blue" style="solid">
            {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}{' '}
            {truncateText(creatorAddressId, DEFAULT_TRUNCATE_LENGTH)}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20231107 - Julian) Creating Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.CREATING_TIME')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="flex flex-wrap items-center">
          <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
          <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
        </div>
      </div>
      {/* Info: (20231107 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-start lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('EVIDENCE_DETAIL_PAGE.CONTENT')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="w-full">
          {/* Info: (20240202 - Julian) Reports */}
          <iframe src={BFA_EVIDENCE_CONTENT_URL} className="h-600px w-full" />
        </div>
      </div>
    </div>
  );
};

export default EvidenceDetail;
