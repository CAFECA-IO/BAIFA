import Image from 'next/image';
import Link from 'next/link';
import {timestampToString} from '../../lib/common';
import {ITransaction} from '../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';

interface ITransactionItemProps {
  transaction: ITransaction;
}

const TransactionItem = ({transaction}: ITransactionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const createdStr = timestampToString(transaction.createdTimestamp);
  // Info: (20230905 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  // Info: (20230908 - Julian) Type i18n
  const typeStr =
    transaction.type === 'Crypto Currency'
      ? t('CHAIN_DETAIL_PAGE.TYPE_CRYPTO')
      : transaction.type === 'NFT'
      ? t('CHAIN_DETAIL_PAGE.TYPE_NFT')
      : t('CHAIN_DETAIL_PAGE.TYPE_EVIDENCE');

  const statusStyle =
    transaction.status === 'PROCESSING'
      ? {
          str: t('CHAIN_DETAIL_PAGE.STATUS_PROCESSING'),
          icon: '/animations/trade_processing.gif',
          style: 'text-hoverWhite',
        }
      : transaction.status === 'SUCCESS'
      ? {
          str: t('CHAIN_DETAIL_PAGE.STATUS_SUCCESS'),
          icon: '/icons/success_icon.svg',
          style: 'text-lightGreen',
        }
      : {
          str: t('CHAIN_DETAIL_PAGE.STATUS_FAILED'),
          icon: '/icons/failed_icon.svg',
          style: 'text-lightRed',
        };

  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20230907 - Julian) Create Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
        {/* Info: (20230907 - Julian) Transaction ID & Type */}
        <Link
          href={`${BFAURL.TRANSACTION}/${transaction.id}`}
          className="inline-flex flex-1 items-baseline space-x-2"
        >
          <h2 className="text-sm lg:text-xl">
            {t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB')}{' '}
            <span className="text-primaryBlue">{transaction.id}</span>
          </h2>
          <p className="hidden text-sm text-lilac lg:block"> - {typeStr}</p>
        </Link>
        {/* Info: (20230907 - Julian) Status */}
        <div className="flex items-center space-x-2 px-2">
          <Image src={statusStyle.icon} width={16} height={16} alt={`${transaction.type}_icon`} />
          <p className={`hidden text-sm lg:block ${statusStyle.style}`}>{statusStyle.str}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
