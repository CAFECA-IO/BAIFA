import {Dispatch, SetStateAction, useState} from 'react';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {ITEM_PER_PAGE, default30DayPeriod, sortOldAndNewOptions} from '@/constants/config';
import {ChainDetailTab} from '@/interfaces/chain';
import {TranslateFunction} from '@/interfaces/locale';
import {ITransactionList} from '@/interfaces/transaction';
import {convertStringToSortingType} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';
import DatePicker from '@/components/date_picker/date_picker';
import {SearchBarWithKeyDown} from '@/components/search_bar/search_bar';
import SortingMenu from '@/components/sorting_menu/sorting_menu';
import TransactionList from '@/components/transaction_list/transaction_list';
import Pagination from '@/components/pagination/pagination';
import Skeleton from '@/components/skeleton/skeleton';

interface ITransactionTabProps {
  chainDetailLoading: boolean;
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
}

const TransactionTab = ({chainDetailLoading, activePage, setActivePage}: ITransactionTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();

  // Info: (20240119 - Julian) get chainId from URL
  const chainId = router.query.chainId as string;
  // Info: (20240220 - Julian) 搜尋條件
  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  // const [activeDefaultPage, setActiveDefaultPage] = useState(1);

  // Info: (20240410 - Liz) Call API to get transaction data (API-009)
  const {data: transactionData, isLoading: isTransactionLoading} = useAPIResponse<ITransactionList>(
    `${APIURL.CHAINS}/${chainId}/transactions`,
    {method: HttpMethod.GET},
    // Info: (20240410 - Liz) 預設值 ?page=1&offset=10&sort=desc&search=&start_date=&end_date=
    {
      page: activePage,
      offset: ITEM_PER_PAGE,
      sort: convertStringToSortingType(sorting),
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
    }
  );

  const {transactions, totalPages} = transactionData ?? {transactions: [], totalPages: 0};

  // Info: (20240206 - Julian) Loading animation
  const skeletonTransactionList = (
    <div className="flex h-680px w-full flex-col py-10">
      {Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <div
          key={index}
          className="flex h-60px w-full items-center gap-8 border-b border-darkPurple4 px-1"
        >
          <Skeleton width={50} height={50} />
          <Skeleton width={200} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  );

  const isShowTransactionList =
    // Info: (20240220 - Julian) TransactionTab 和 ChainDetailPage 都完成 Loading 後才顯示 TransactionList
    isTransactionLoading || chainDetailLoading ? (
      skeletonTransactionList
    ) : (
      <TransactionList transactions={transactions} />
    );

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20231101 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20231101 - Julian) Search Bar */}
        <div className="flex w-full items-center justify-center lg:w-7/10">
          {/* Info: (20240222 - Julian) Search Bar */}
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_TRANSACTIONS'),
            setSearch,
            setActivePage: setActivePage,
          })}
        </div>
        <div className="flex w-full flex-col items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Info: (20231101 - Julian) Date Picker */}
          <div className="flex w-full items-center text-base lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker
              period={period}
              setFilteredPeriod={setPeriod}
              setActivePage={setActivePage}
            />
          </div>

          {/* Info: (20230904 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
              bgColor="bg-darkPurple"
              setActivePage={setActivePage}
            />
          </div>
        </div>
      </div>
      {/* Info: (20230907 - Julian) Transaction List */}
      <div className="flex w-full flex-col items-center">
        {isShowTransactionList}

        <Pagination
          pagePrefix={ChainDetailTab.TRANSACTIONS}
          activePage={activePage}
          setActivePage={setActivePage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default TransactionTab;
