import {useState, useEffect} from 'react';
import TransactionItem from '../transaction_item/transaction_item';
import Pagination from '../pagination/pagination';
import {ITEM_PER_PAGE} from '../../constants/config';
import {ITransactionData} from '../../interfaces/transaction_data';

export interface ITransactionListProps {
  transactions: ITransactionData[];
}

const TransactionList = ({transactions}: ITransactionListProps) => {
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(transactions.length / ITEM_PER_PAGE));

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    setActivePage(1);
    setTotalPages(Math.ceil(transactions.length / ITEM_PER_PAGE));
  }, [transactions]);

  const transactionList = transactions
    .map((transaction, index) => <TransactionItem key={index} transaction={transaction} />)
    .slice(startIdx, endIdx);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-320px w-full flex-col items-center py-10">{transactionList}</div>
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </div>
  );
};

export default TransactionList;
