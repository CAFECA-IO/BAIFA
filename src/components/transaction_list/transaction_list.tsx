import {useTranslation} from 'next-i18next';
import {IDisplayTransaction} from '@/interfaces/transaction';
import {TranslateFunction} from '@/interfaces/locale';
import TransactionItem from '@/components/transaction_item/transaction_item';

export interface ITransactionListProps {
  transactions: IDisplayTransaction[];
}

const TransactionList = ({transactions}: ITransactionListProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const transactionList =
    transactions && transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <TransactionItem key={index} transaction={transaction} />
      ))
    ) : (
      <h2>{t('COMMON.NO_DATA')}</h2>
    );

  return (
    <div className="flex min-h-320px w-full flex-col items-center py-10">{transactionList}</div>
  );
};

export default TransactionList;
