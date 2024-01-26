import Image from 'next/image';
import Link from 'next/link';
import BoltButton from '../bolt_button/bolt_button';
import Tooltip from '../tooltip/tooltip';
import {timestampToString, truncateText} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ITransactionDetail} from '../../interfaces/transaction';
import {BFAURL, getDynamicUrl} from '../../constants/url';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface ITransactionDetailProps {
  transactionData: ITransactionDetail;
}

const TransactionDetail = ({transactionData}: ITransactionDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    hash,
    status,
    chainId,
    blockId,
    createdTimestamp,
    from,
    to,
    evidenceId,
    fee,
    flaggingRecords,
    unit,
  } = transactionData;

  const blockLink = getDynamicUrl(chainId, `${blockId}`).BLOCK;

  // Info: (20231215 - Julian) Print all from/to address
  const fromList = from
    ? from.map((data, index) => {
        const fromLink =
          data.type === 'address'
            ? getDynamicUrl(chainId, `${data.address}`).ADDRESS
            : getDynamicUrl(chainId, `${data.address}`).CONTRACT;

        const fromText =
          data.type === 'address'
            ? t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')
            : t('CONTRACT_DETAIL_PAGE.MAIN_TITLE');
        return (
          <Link href={fromLink} key={index} title={data.address}>
            <BoltButton className="px-3 py-1" color="blue" style="solid">
              {fromText} {truncateText(data.address, DEFAULT_TRUNCATE_LENGTH)}
            </BoltButton>
          </Link>
        );
      })
    : [];

  const toList = to
    ? to.map((data, index) => {
        const toLink =
          data.type === 'address'
            ? getDynamicUrl(chainId, `${data.address}`).ADDRESS
            : getDynamicUrl(chainId, `${data.address}`).CONTRACT;

        const toText =
          data.type === 'address'
            ? t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')
            : t('CONTRACT_DETAIL_PAGE.MAIN_TITLE');
        return (
          <Link href={toLink} key={index} title={data.address}>
            <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
              {toText} {truncateText(data.address, DEFAULT_TRUNCATE_LENGTH)}
            </BoltButton>
          </Link>
        );
      })
    : [];

  const displayStatus =
    status === 'PROCESSING' ? (
      <div className="flex items-center text-hoverWhite">
        <Image
          src="/animations/trade_processing.gif"
          alt="processing_icon"
          width={20}
          height={20}
        />
        <p className="ml-2 text-sm text-hoverWhite lg:text-base">
          {t('CHAIN_DETAIL_PAGE.STATUS_PROCESSING')}
        </p>
      </div>
    ) : status === 'SUCCESS' ? (
      <div className="flex items-center text-lightGreen">
        <Image src="/icons/success_icon.svg" alt="success_icon" width={20} height={20} />
        <p className="ml-2 text-sm text-lightGreen lg:text-base">
          {t('CHAIN_DETAIL_PAGE.STATUS_SUCCESS')}
        </p>
      </div>
    ) : (
      <div className="flex items-center text-lightRed">
        <Image src="/icons/failed_icon.svg" alt="failed_icon" width={20} height={20} />
        <p className="ml-2 text-sm text-lightRed lg:text-base">
          {t('CHAIN_DETAIL_PAGE.STATUS_FAILED')}
        </p>
      </div>
    );

  // ToDo: (20230911 - Julian) flagging
  const displayFlagging =
    // Info: (20240111 - Julian) If flaggingRecords is not null and length is not 0, then display flaggingRecords
    !!flaggingRecords && flaggingRecords.length !== 0 ? (
      flaggingRecords.map((flaggingRecord, index) => {
        const redFlagLink = getDynamicUrl(chainId, `${flaggingRecord.redFlagId}`).RED_FLAG;
        return (
          <Link key={index} href={redFlagLink}>
            <BoltButton className="w-fit px-3 py-1" color="red" style="solid">
              {t(flaggingRecord.redFlagType)}
            </BoltButton>
          </Link>
        );
      })
    ) : (
      <p>{t('COMMON.NONE')}</p>
    );

  const displayTime = (
    <div className="flex flex-wrap items-center space-x-2">
      <p>{timestampToString(createdTimestamp).date}</p>
      <p>{timestampToString(createdTimestamp).time}</p>
    </div>
  );

  const displayEvidence = evidenceId ? (
    <Link href={getDynamicUrl(`${chainId}`, `${evidenceId}`).EVIDENCE}>
      <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
        {t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} {evidenceId}
      </BoltButton>
    </Link>
  ) : (
    <p>{t('COMMON.NONE')}</p>
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230911 - Julian) Hash */}
      <div className="flex flex-col space-y-2 px-3 py-4 text-sm lg:flex-row lg:items-center lg:space-y-0 lg:text-base">
        <p className="font-bold text-lilac lg:w-200px">{t('TRANSACTION_DETAIL_PAGE.HASH')}</p>
        <p className="break-all">{hash}</p>
      </div>
      {/* Info: (20230911 - Julian) Status */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.STATUS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayStatus}
      </div>
      {/* Info: (20230911 - Julian) Block */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.BLOCK')}
        </p>
        <Link href={blockLink}>
          <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
            {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} {blockId}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20230911 - Julian) Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.TIME')}
        </p>
        {displayTime}
      </div>
      {/* Info: (20230911 - Julian) From */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.FROM')}
        </p>
        <div className="flex flex-wrap items-center space-x-2">{fromList}</div>
      </div>
      {/* Info: (20230911 - Julian) To */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.TO')}
        </p>
        <div className="flex flex-wrap items-center space-x-2">{toList}</div>
      </div>
      {/* Info: (20230911 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.CONTENT')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayEvidence}
      </div>
      {/* Info: (20230911 - Julian) Value */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.VALUE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {/* ToDo: (20230911 - Julian) log in button */}
        <Link href={BFAURL.COMING_SOON}>
          <p className="text-primaryBlue underline underline-offset-2">{t('COMMON.LOG_IN_ONLY')}</p>
        </Link>
      </div>
      {/* Info: (20230911 - Julian) Fee */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FEE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <p>
          {fee} {unit}
        </p>
      </div>
      {/* Info: (20230911 - Julian) Flagging */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FLAGGING')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayFlagging}
      </div>
    </div>
  );
};

export default TransactionDetail;
