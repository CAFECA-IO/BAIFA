import Image from 'next/image';
import Link from 'next/link';
import {timestampToString, truncateText} from '../../lib/common';
import {IDisplayTransaction} from '../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {getDynamicUrl} from '../../constants/url';
import {TransactionType, DefaultTransactionType} from '../../constants/transaction_type';
import {TransactionStatus, DefaultTransactionStatus} from '../../constants/transaction_status';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface ITransactionItemProps {
  transaction: IDisplayTransaction;
}

const TransactionItem = ({transaction}: ITransactionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, chainId, createdTimestamp, type, status} = transaction;

  const transactionLink = getDynamicUrl(chainId, `${id}`).TRANSACTION;

  const createdStr = timestampToString(createdTimestamp);
  // Info: (20230905 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  // Info: (20230908 - Julian) Type i18n
  const typeStr = TransactionType[type] ?? DefaultTransactionType;
  const statusContent = TransactionStatus[status] ?? DefaultTransactionStatus;

  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20230907 - Julian) Create Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
        {/* Info: (20230907 - Julian) Transaction ID (hash) & Type */}
        <Link href={transactionLink} className="inline-flex flex-1 items-baseline space-x-2">
          <h2 title={id} className="text-sm lg:text-xl">
            {t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB')}
            <span className="text-primaryBlue"> {truncateText(id, DEFAULT_TRUNCATE_LENGTH)}</span>
          </h2>
          <p className="hidden text-sm text-lilac lg:block"> - {t(typeStr)}</p>
        </Link>
        {/* Info: (20230907 - Julian) Status */}
        <div className="flex items-center space-x-2 px-2">
          <Image
            src={statusContent.icon}
            width={16}
            height={16}
            alt={`${statusContent.text}_icon`}
          />
          <p className={`hidden text-sm lg:block ${statusContent.color}`}>
            {t(statusContent.text)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
