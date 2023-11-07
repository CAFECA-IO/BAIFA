import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import TransactionList from '../transaction_list/transaction_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ITransaction} from '../../interfaces/transaction';
import SearchBar from '../search_bar/search_bar';
import DatePicker from '../date_picker/date_picker';
import SortingMenu from '../sorting_menu/sorting_menu';
import {sortOldAndNewOptions} from '../../constants/config';

interface ITransactionTabProps {
  transactionList: ITransaction[];
}

const TransactionTab = ({transactionList}: ITransactionTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [search, setSearch, searchRef] = useStateRef('');
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>(transactionList);

  useEffect(() => {
    const searchResult = transactionList
      // Info: (20230905 - Julian) filter by date range
      .filter((transaction: ITransaction) => {
        const createdTimestamp = transaction.createdTimestamp;
        const start = period.startTimeStamp;
        const end = period.endTimeStamp;
        // Info: (20230905 - Julian) if start and end are 0, it means that there is no period filter
        const isCreatedTimestampInRange =
          start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
        return isCreatedTimestampInRange;
      })
      // Info: (20230905 - Julian) filter by search term
      .filter((transaction: ITransaction) => {
        const searchTerm = searchRef.current.toLowerCase();
        const transactionId = transaction.id.toString().toLowerCase();
        const status = transaction.status.toLowerCase();
        const blockId = transaction.blockId.toString().toLowerCase();
        const fromAddress = transaction.from.toString().toLowerCase();
        const toAddress = transaction.to.toString().toLowerCase();

        return searchTerm !== ''
          ? transactionId.includes(searchTerm) ||
              status.includes(searchTerm) ||
              blockId.includes(searchTerm) ||
              fromAddress.includes(searchTerm) ||
              toAddress.includes(searchTerm)
          : true;
      })
      .sort((a: ITransaction, b: ITransaction) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231101 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231101 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredTransactions(searchResult);
  }, [period, search, sorting]);

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20231101 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20231101 - Julian) Search Bar */}
        <div className="flex w-full items-center justify-center lg:w-7/10">
          <SearchBar
            searchBarPlaceholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_TRANSACTIONS')}
            setSearch={setSearch}
          />
        </div>
        <div className="flex w-full flex-col items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Info: (20231101 - Julian) Date Picker */}
          <div className="flex w-full items-center text-base lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker setFilteredPeriod={setPeriod} />
          </div>

          {/* Info: (20230904 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>
        </div>
      </div>
      {/* Info: (20230907 - Julian) Transaction List */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
};

export default TransactionTab;
