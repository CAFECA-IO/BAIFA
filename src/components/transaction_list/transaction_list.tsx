import TransactionItem from '../transaction_item/transaction_item';
import {IDisplayTransaction} from '../../interfaces/transaction';

export interface ITransactionListProps {
  transactions: IDisplayTransaction[];
}

// Info: (20240119 - Julian) 考慮是否廢棄這個 component

const TransactionList = ({transactions}: ITransactionListProps) => {
  const transactionList = transactions.map((transaction, index) => (
    <TransactionItem key={index} transaction={transaction} />
  ));

  return (
    <div className="flex min-h-320px w-full flex-col items-center py-10">{transactionList}</div>
  );
};

export default TransactionList;
