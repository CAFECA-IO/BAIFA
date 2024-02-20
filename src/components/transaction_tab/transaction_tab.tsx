import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import TransactionList from '../transaction_list/transaction_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ITransactionList} from '../../interfaces/transaction';
import SearchBar from '../search_bar/search_bar';
import DatePicker from '../date_picker/date_picker';
import SortingMenu from '../sorting_menu/sorting_menu';
import {default30DayPeriod, sortOldAndNewOptions} from '../../constants/config';
import {MarketContext} from '../../contexts/market_context';
import Pagination from '../pagination/pagination';
import Skeleton from '../skeleton/skeleton';

interface ITransactionTabProps {
  chainDetailLoading: boolean;
}

const TransactionTab = ({chainDetailLoading}: ITransactionTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {getTransactionList} = useContext(MarketContext);

  // Info: (20240119 - Julian) get chainId from URL
  const chainId = router.query.chainId as string;
  // Info: (20240220 - Julian) 搜尋條件
  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  // Info: (20240220 - Julian) API 查詢參數
  const [apiQueryStr, setApiQueryStr] = useState('');
  // Info: (20240220 - Julian) UI
  const [transactionData, setTransactionData] = useState<ITransactionList>();
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);

  // Info: (20240119 - Julian) Call API to get block and transaction data
  const getTransactionData = async () => {
    // Info: (20240220 - Julian) Loading 畫面
    setIsLoading(true);

    try {
      const data = await getTransactionList(chainId, apiQueryStr);
      setTransactionData(data);
    } catch (error) {
      //console.log('getTransactionList error', error);
    }
    // Info: (20240220 - Julian) 如果拿到資料，就將 isLoading 設為 false
    setIsLoading(false);
  };

  useEffect(() => {
    // Info: (20240217 - Julian) 如果 3 秒後還沒拿到資料，也將 isLoading 設為 false
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, transactionData]);

  useEffect(() => {
    // Info: (20240220 - Julian) 當日期改變時，重設 activePage
    setActivePage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    // Info: (20240220 - Julian) 當 activePage 改變時，重新取得資料
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  useEffect(() => {
    // Info: (20240119 - Julian) 設定 API 查詢參數
    // ToDo: (20240220 - Julian) date query string
    const pageQuery = `page=${activePage}`;
    // Info: (20240220 - Julian) 當搜尋條件改變時，重新取得資料
    setApiQueryStr(`${pageQuery}`);
  }, [activePage, period]);

  const {transactions, totalPages} = transactionData || {transactions: [], totalPages: 0};

  const isShowTransactionList =
    // Info: (20240220 - Julian) TransactionTab 和 ChainDetailPage 都完成 Loading 後才顯示 TransactionList
    isLoading || chainDetailLoading ? (
      // Info: (20240206 - Julian) Loading animation
      <div className="flex w-full flex-col py-10 divide-y divide-darkPurple4 h-680px">
        {Array.from({length: 10}).map((_, index) => (
          <div key={index} className="flex w-full items-center gap-8 py-5px">
            <Skeleton width={50} height={50} />
            <Skeleton width={80} height={20} />
            <div className="ml-auto">
              <Skeleton width={80} height={20} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <TransactionList transactions={transactions} />
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
      <div className="flex w-full flex-col items-center">
        {isShowTransactionList}

        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default TransactionTab;
