import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, use} from 'react';
import useStateRef from 'react-usestateref';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {ITEM_PER_PAGE, sortOldAndNewOptions, default30DayPeriod} from '../../constants/config';
import {timestampToString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';
import {IDisplayTransaction} from '../../interfaces/transaction';
import DatePicker from '../date_picker/date_picker';

interface ITransactionHistorySectionProps {
  transactions: IDisplayTransaction[];
  loading?: boolean;
}

const itemSkeleton = (
  <div className="flex items-center justify-between">
    <div>
      <div className="mb-2.5 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
  </div>
);

const listSkeleton = (
  <div
    role="status"
    className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
  >
    {/* Info: generate 10 skeletons (20240207 - Shirley) */}
    {Array.from({length: 10}, (_, index) => (
      <div key={index} className={`${index !== 0 ? `pt-4` : ``}`}>
        {itemSkeleton}
      </div>
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);

const TransactionHistorySection = ({transactions, loading}: ITransactionHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(1 / ITEM_PER_PAGE));

  const [filteredTransactions, setFilteredTransactions] =
    useState<IDisplayTransaction[]>(transactions);
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState(default30DayPeriod);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loadingState, setLoadingState] = useState(loading);

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  // Info: (20240103 - Julian) Update the address options when transactions are updated
  useEffect(() => {
    setFilteredTransactions(transactions);
    setTransactionCount(transactions.length);
    setTotalPages(Math.ceil(transactions.length / ITEM_PER_PAGE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  // Info: (20231113 - Julian) Filter by search term, to address, and sorting
  useEffect(() => {
    const searchResult = transactions // Info: (20231113 - Julian) filter by search term
      .filter((transaction: IDisplayTransaction) => {
        const searchTerm = searchRef.current.toLowerCase();
        const transactionId = transaction.id.toString().toLowerCase();
        const status = transaction.status.toLowerCase();

        return searchTerm !== ''
          ? transactionId.includes(searchTerm) || status.includes(searchTerm)
          : true;
      })
      // Info: (20240205 - Julian) filter by date range
      .filter((transaction: IDisplayTransaction) => {
        const {createdTimestamp} = transaction;
        const {startTimeStamp, endTimeStamp} = period;
        const isSelectingDate = startTimeStamp !== 0 && endTimeStamp !== 0;

        return isSelectingDate
          ? createdTimestamp >= startTimeStamp && createdTimestamp <= endTimeStamp
          : true;
      })
      .sort((a, b) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231113 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231113 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });

    setFilteredTransactions(searchResult);
    setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
    setActivePage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sorting, period]);

  // Info: (20240103 - Julian) The count of transaction history
  // const transactionCount = transactions ? transactions.length : 0;

  // Info: (20231113 - Julian) Pagination
  const transactionList = filteredTransactions
    ? filteredTransactions.slice(startIdx, endIdx).map((transaction, index) => {
        const {id, chainId, createdTimestamp, status} = transaction;
        const transactionLink = getDynamicUrl(chainId, `${id}`).TRANSACTION;

        const createdStr = timestampToString(createdTimestamp);
        // Info: (20231113 - Julian) If month is longer than 3 letters, slice it and add a dot
        const monthStr =
          t(createdStr.month).length > 3
            ? `${t(createdStr.month).slice(0, 3)}.`
            : t(createdStr.month);

        const statusStyle =
          status === 'Pending'
            ? {
                str: t('CHAIN_DETAIL_PAGE.STATUS_PROCESSING'),
                icon: '/animations/trade_processing.gif',
                style: 'text-hoverWhite',
              }
            : status === 'Success'
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
          // Info: (20231113 - Julian) Transaction History Item
          <div key={index} className="flex h-60px w-full items-center">
            {/* Info: (20231113 - Julian) Create Time square */}
            <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-purpleLinear">
              <p className="text-xl">{createdStr.day}</p>
              <p className="text-xs">{monthStr}</p>
              <p className="text-xs text-lilac">{createdStr.time}</p>
            </div>
            <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
              {/* Info: (20231113 - Julian) Transaction ID & Type */}
              <Link href={transactionLink} className="inline-flex flex-1 items-baseline space-x-2">
                <h2 className="text-sm lg:text-xl">
                  {t('COMMON.TRANSACTION_HISTORY_TRANSACTION_ID')}
                  <span className="text-primaryBlue"> {transaction.id}</span>
                </h2>
              </Link>
              {/* Info: (20231113 - Julian) Status */}
              <div className="flex items-center space-x-2 px-2">
                <Image
                  src={statusStyle.icon}
                  width={16}
                  height={16}
                  alt={`${statusStyle.str}_icon`}
                />
                <p className={`hidden text-sm lg:block ${statusStyle.style}`}>{statusStyle.str}</p>
              </div>
            </div>
          </div>
        );
      })
    : [];

  const displayedTransactionList = !loading ? transactionList : listSkeleton;

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231113 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.TRANSACTION_HISTORY_TITLE')} ({transactionCount})
      </h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple px-6 py-4 drop-shadow-xl lg:h-1050px">
        {/* Info: (20231113 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end space-y-4">
          <div className="flex w-full flex-col items-center justify-between lg:flex-row">
            {/* Info: (20231101 - Julian) Address Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} :</p>
              <DatePicker period={period} setFilteredPeriod={setPeriod} isLinearBg />
            </div>
            {/* Info: (20231113 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sortingOptions={sortOldAndNewOptions}
                sorting={sorting}
                setSorting={setSorting}
                bgColor="bg-purpleLinear"
              />
            </div>
          </div>
          {/* Info: (20231113 - Julian) Search Bar */}
          <SearchBar
            searchBarPlaceholder={t('COMMON.TRANSACTION_HISTORY_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        {/* Info: (20231113 - Julian) To Address List */}
        <div className="my-10 flex w-full flex-1 flex-col">{displayedTransactionList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default TransactionHistorySection;
