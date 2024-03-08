import Image from 'next/image';
import Link from 'next/link';
import BoltButton from '../bolt_button/bolt_button';
import Tooltip from '../tooltip/tooltip';
import {timestampToString, truncateText} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ITransactionDetail} from '../../interfaces/transaction';
import {BFAURL, getDynamicUrl} from '../../constants/url';
import {TransactionStatus, DefaultTransactionStatus} from '../../constants/transaction_status';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';
import Skeleton from '../skeleton/skeleton';
import {useState, useEffect} from 'react';

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

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    // Info: (20240217 - Julian) 如果沒有拿到資料就持續 Loading
    if (!transactionData.id) return;
    // Info: (20240217 - Julian) 1 秒後顯示資料
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [transactionData]);

  const blockLink = getDynamicUrl(chainId, `${blockId}`).BLOCK;

  const displayHash = isShow ? (
    <p className="break-all">{hash}</p>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <Skeleton height={24} width={200} />
  );

  // Info: (20240205 - Julian) 根據 status 取得對應的圖示、文字內容和顏色；沒有 status 對應的內容時就使用預設值
  const statusContent = TransactionStatus[status] ?? DefaultTransactionStatus;
  const displayStatus = isShow ? (
    <div className="flex items-center">
      <Image src={statusContent.icon} width={20} height={20} alt={t(statusContent.text)} />
      <p className={`ml-2 text-sm lg:text-base ${statusContent.color}`}>{t(statusContent.text)}</p>
    </div>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <div className="flex items-center space-x-1">
      <Skeleton height={24} width={24} rounded />
      <Skeleton height={24} width={80} />
    </div>
  );

  const displayBlock = isShow ? (
    <Link href={blockLink}>
      <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
        {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} {blockId}
      </BoltButton>
    </Link>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <Skeleton height={24} width={80} />
  );

  const displayTime = isShow ? (
    <div className="flex flex-wrap items-center space-x-2">
      <p>{timestampToString(createdTimestamp).date}</p>
      <p>{timestampToString(createdTimestamp).time}</p>
    </div>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <div className="flex items-center space-x-3">
      <Skeleton height={24} width={80} />
      <Skeleton height={24} width={80} />
    </div>
  );

  // Info: (20231215 - Julian) Print all from/to address
  const fromList = // Info: (20240205 - Julian) 如果 from 不為 null 且長度不是 0，則印出 from 的內容；否則顯示 NONE
    !!from && from.length !== 0 ? (
      from.map((data, index) => {
        const fromLink =
          data.type === 'address'
            ? getDynamicUrl(chainId, `${data.address}`).ADDRESS
            : getDynamicUrl(chainId, `${data.address}`).CONTRACT;

        const fromText =
          data.type === 'address'
            ? t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')
            : t('CONTRACT_DETAIL_PAGE.MAIN_TITLE');
        return (
          <Link href={fromLink} key={index} title={data.address}>
            <BoltButton className="px-3 py-1" color="blue" style="solid">
              {fromText} {truncateText(data.address, DEFAULT_TRUNCATE_LENGTH)}
            </BoltButton>
          </Link>
        );
      })
    ) : (
      <p>{t('COMMON.NONE')}</p>
    );
  const displayFrom = isShow ? fromList : <Skeleton height={24} width={80} />;

  const toList =
    // Info: (20240205 - Julian) 如果 to 不為 null 且長度不是 0，則印出 to 的內容；否則顯示 NONE
    !!to && to.length !== 0 ? (
      to.map((data, index) => {
        const toLink =
          data.type === 'address'
            ? getDynamicUrl(chainId, `${data.address}`).ADDRESS
            : getDynamicUrl(chainId, `${data.address}`).CONTRACT;

        const toText =
          data.type === 'address'
            ? t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')
            : t('CONTRACT_DETAIL_PAGE.MAIN_TITLE');
        return (
          <Link href={toLink} key={index} title={data.address}>
            <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
              {toText} {truncateText(data.address, DEFAULT_TRUNCATE_LENGTH)}
            </BoltButton>
          </Link>
        );
      })
    ) : (
      <p>{t('COMMON.NONE')}</p>
    );
  const displayTo = isShow ? toList : <Skeleton height={24} width={80} />;

  const evidence = !!evidenceId ? (
    <Link title={evidenceId} href={getDynamicUrl(`${chainId}`, `${evidenceId}`).EVIDENCE}>
      <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
        {t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} {truncateText(evidenceId, 10)}
      </BoltButton>
    </Link>
  ) : (
    <p>{t('COMMON.NONE')}</p>
  );
  const displayContent = isShow ? evidence : <Skeleton height={24} width={80} />;

  const displayFee = isShow ? (
    <p>
      {fee} {unit}
    </p>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <Skeleton height={24} width={80} />
  );

  const displayValue = isShow ? (
    <Link href={BFAURL.COMING_SOON}>
      <p className="text-primaryBlue underline underline-offset-2">{t('COMMON.LOG_IN_ONLY')}</p>
    </Link>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <Skeleton height={24} width={80} />
  );

  const Flagging =
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
  const displayFlagging = isShow ? Flagging : <Skeleton height={24} width={80} />;

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230911 - Julian) Hash */}
      <div className="flex flex-col space-y-2 px-3 py-4 text-sm lg:flex-row lg:items-center lg:space-y-0 lg:text-base">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.HASH')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.HASH_TOOLTIP')}</Tooltip>
        </div>
        {displayHash}
      </div>
      {/* Info: (20230911 - Julian) Status */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.STATUS')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.STATUS_TOOLTIP')}</Tooltip>
        </div>
        {displayStatus}
      </div>
      {/* Info: (20230911 - Julian) Block */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.BLOCK')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.BLOCK_TOOLTIP')}</Tooltip>
        </div>
        {displayBlock}
      </div>
      {/* Info: (20230911 - Julian) Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.TIME')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.TIME_TOOLTIP')}</Tooltip>
        </div>
        {displayTime}
      </div>
      {/* Info: (20230911 - Julian) From */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FROM')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.FROM_TOOLTIP')}</Tooltip>
        </div>
        <div className="flex flex-wrap items-center space-x-2">{displayFrom}</div>
      </div>
      {/* Info: (20230911 - Julian) To */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.TO')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.TO_TOOLTIP')}</Tooltip>
        </div>
        <div className="flex flex-wrap items-center space-x-2">{displayTo}</div>
      </div>
      {/* Info: (20230911 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.CONTENT')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.CONTENT_TOOLTIP')}</Tooltip>
        </div>
        {displayContent}
      </div>
      {/* Info: (20230911 - Julian) Value */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.VALUE')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.VALUE_TOOLTIP')}</Tooltip>
        </div>
        {/* ToDo: (20230911 - Julian) log in button */}
        {displayValue}
      </div>
      {/* Info: (20230911 - Julian) Fee */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FEE')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.FEE_TOOLTIP')}</Tooltip>
        </div>
        {displayFee}
      </div>
      {/* Info: (20230911 - Julian) Flagging */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FLAGGING')}</p>
          <Tooltip>{t('TRANSACTION_DETAIL_PAGE.FLAGGING_TOOLTIP')}</Tooltip>
        </div>
        {displayFlagging}
      </div>
    </div>
  );
};

export default TransactionDetail;
