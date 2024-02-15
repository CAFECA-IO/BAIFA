import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import TransactionList from '../transaction_list/transaction_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IDisplayTransaction} from '../../interfaces/transaction';
import SearchBar from '../search_bar/search_bar';
import DatePicker from '../date_picker/date_picker';
import SortingMenu from '../sorting_menu/sorting_menu';
import {default30DayPeriod, sortOldAndNewOptions} from '../../constants/config';
import {MarketContext} from '../../contexts/market_context';
import Pagination from '../pagination/pagination';

const TransactionTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {getTransactions} = useContext(MarketContext);

  // Info: (20240119 - Julian) get chainId from URL
  const chainId = router.query.chainId as string;

  const totalPages = 100; // ToDo: (20240119 - Julian) 如何從 API 取得總頁數？
  const [activePage, setActivePage] = useState(1);

  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [transactionData, setTransactionData] = useState<IDisplayTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Info: (20240119 - Julian) 設定 API 查詢參數
  const dateQuery =
    period.startTimeStamp === 0 || period.endTimeStamp === 0
      ? ''
      : `&start_date=${period.startTimeStamp}&end_date=${period.endTimeStamp}`;
  const pageQuery = `page=${activePage}`;

  const apiQueryStr = `${pageQuery}${dateQuery}`;

  // Info: (20240119 - Julian) Call API to get block and transaction data
  const getTransactionData = async () => {
    const data = await getTransactions(chainId, apiQueryStr);
    setTransactionData(data);
  };

  useEffect(() => {
    setIsLoading(true);

    // Info: (20240206 - Julian) 如果拿到資料，就將 isLoading 設為 false
    if (transactionData.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, transactionData]);

  useEffect(() => {
    setActivePage(1);
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, chainId]);

  useEffect(() => {
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredTransactions, setFilteredTransactions] =
    useState<IDisplayTransaction[]>(transactionData);

  useEffect(() => {
    const searchResult = transactionData
      // Info: (20230905 - Julian) filter by search term
      // .filter((transaction: ITransaction) => {
      //   const searchTerm = searchRef.current.toLowerCase();
      //   const transactionId = transaction.id.toString().toLowerCase();
      //   const status = transaction.status.toLowerCase();

      //   return searchTerm !== ''
      //     ? transactionId.includes(searchTerm) || status.includes(searchTerm)
      //     : true;
      // })
      .sort((a, b) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231101 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231101 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredTransactions(searchResult);
  }, [transactionData, search, sorting]);

  const displayTransactionList = isLoading ? (
    // Info: (20240206 - Julian) Loading animation
    <div className="flex w-full flex-col gap-2 py-10">
      {Array.from({length: 3}).map((_, index) => (
        <div key={index} className="flex w-full items-center gap-5">
          <div className="h-60px w-60px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1">
            <div className="h-20px w-100px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-20px w-100px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-col items-center">
      <TransactionList transactions={filteredTransactions} />
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </div>
  );

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
            <DatePicker period={period} setFilteredPeriod={setPeriod} />
          </div>

          {/* Info: (20230904 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
              bgColor="bg-darkPurple"
            />
          </div>
        </div>
      </div>
      {/* Info: (20230907 - Julian) Transaction List */}
      {displayTransactionList}
    </div>
  );
};

export default TransactionTab;
