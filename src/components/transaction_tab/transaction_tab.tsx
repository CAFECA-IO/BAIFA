import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import TransactionList from '../transaction_list/transaction_list';
import SearchFilter from '../search_filter/search_filter';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {dummyTransactionData, ITransactionData} from '../../interfaces/transaction_data';

const TransactionTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [search, setSearch, searchRef] = useStateRef('');
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  const [sorting, setSorting] = useState<'Newest' | 'Oldest'>('Newest');
  const [filteredTransactions, setFilteredTransactions] =
    useState<ITransactionData[]>(dummyTransactionData);

  useEffect(() => {
    const searchResult = dummyTransactionData
      // Info: (20230905 - Julian) filter by date range
      .filter((transaction: ITransactionData) => {
        const createdTimestamp = transaction.createdTimestamp;
        const start = period.startTimeStamp;
        const end = period.endTimeStamp;
        // Info: (20230905 - Julian) if start and end are 0, it means that there is no period filter
        const isCreatedTimestampInRange =
          start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
        return isCreatedTimestampInRange;
      })
      // Info: (20230905 - Julian) filter by search term
      .filter((transaction: ITransactionData) => {
        const searchTerm = searchRef.current.toLowerCase();
        const transactionId = transaction.id.toString().toLowerCase();
        const status = transaction.status.toLowerCase();
        const blockId = transaction.blockId.toString().toLowerCase();
        const fromAddress = transaction.from.toString().toLowerCase();
        const toAddress = transaction.to.toString().toLowerCase();
        const content = transaction.content.toString().toLowerCase();

        return searchTerm !== ''
          ? transactionId.includes(searchTerm) ||
              status.includes(searchTerm) ||
              blockId.includes(searchTerm) ||
              fromAddress.includes(searchTerm) ||
              toAddress.includes(searchTerm) ||
              content.includes(searchTerm)
          : true;
      })
      .sort((a: ITransactionData, b: ITransactionData) => {
        return sorting === 'Newest'
          ? b.createdTimestamp - a.createdTimestamp
          : a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredTransactions(searchResult);
  }, [period, search, sorting]);

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20230907 - Julian) Search Filter */}
      <SearchFilter
        searchBarPlaceholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_BLOCKS')}
        setSearch={setSearch}
        setPeriod={setPeriod}
        sorting={sorting}
        setSorting={setSorting}
      />
      {/* Info: (20230907 - Julian) Transaction List */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
};

export default TransactionTab;
