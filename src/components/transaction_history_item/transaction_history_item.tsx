import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {timestampToString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {DefaultTransactionStatus, TransactionStatus} from '../../constants/transaction_status';
import {IDisplayTransaction} from '../../interfaces/transaction';
import {DefaultTransactionType, TransactionType} from '../../constants/transaction_type';

interface ITransactionHistoryItemProps {
  transaction: IDisplayTransaction;
}

const TransactionHistoryItem = ({transaction}: ITransactionHistoryItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {id, chainId, createdTimestamp, status, type} = transaction;
  const transactionLink = getDynamicUrl(chainId, `${id}`).TRANSACTION;

  const createdStr = timestampToString(createdTimestamp);
  // Info: (20231113 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  // Info: (20240222 - Julian) 根據 status 取得對應的圖示、文字內容和顏色；沒有 status 對應的內容時就使用預設值
  const statusContent = TransactionStatus[status] ?? DefaultTransactionStatus;
  const typeStr = TransactionType[type] ?? DefaultTransactionType;

  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20231113 - Julian) Create Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-purpleLinear">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
        {/* Info: (20231113 - Julian) Transaction ID & Type */}
        <Link
          href={transactionLink}
          className="inline-flex flex-1 items-baseline space-x-2 text-sm text-primaryBlue lg:text-xl"
        >
          <p className="hidden text-hoverWhite lg:block">
            {t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB')}{' '}
          </p>
          <h2
            title={transaction.id}
            className="w-100px grow space-x-2 overflow-hidden text-ellipsis whitespace-nowrap lg:w-500px"
          >
            {transaction.id}
          </h2>
          <p className="w-100px whitespace-nowrap text-xs text-lilac lg:w-120px lg:text-sm">
            {' '}
            - {t(typeStr)}
          </p>
        </Link>
        {/* Info: (20231113 - Julian) Status */}
        <div className="flex h-20px w-20px items-center space-x-2 lg:w-100px lg:px-2">
          <Image src={statusContent.icon} width={16} height={16} alt={`${status}_icon`} />
          <p className={`hidden text-sm lg:block ${statusContent.color}`}>
            {t(statusContent.text)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryItem;
