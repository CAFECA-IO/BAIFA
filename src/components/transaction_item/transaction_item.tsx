import {timestampToString} from '../../lib/common';
import {ITransactionData} from '../../interfaces/transaction_data';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

interface ITransactionItemProps {
  transaction: ITransactionData;
}

const TransactionItem = ({transaction}: ITransactionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const createdStr = timestampToString(transaction.createdTimestamp);
  // Info: (20230905 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  // ToDo: (20230907 - Julian) i18n
  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20230907 - Julian) Create Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-8">
        {/* Info: (20230907 - Julian) Transaction ID & Type */}
        <div className="inline-flex flex-1 items-baseline space-x-2">
          <h2 className="text-xl">
            Transaction <span className="text-primaryBlue">{transaction.id}</span>
          </h2>
          <p className="text-sm text-lilac"> - {transaction.type}</p>
        </div>
        {/* Info: (20230907 - Julian) Status */}
        <div className="flex items-center space-x-2 px-2">
          <p className="text-sm">Status</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
