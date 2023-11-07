import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {ITEM_PER_PAGE, sortOldAndNewOptions} from '../../constants/config';
import {timestampToString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';
import DatePicker from '../date_picker/date_picker';
import {ITransaction} from '../../interfaces/transaction';

interface ITransactionHistorySectionProps {
  transactions: ITransaction[];
}

const TransactionHistorySection = ({transactions}: ITransactionHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(1 / ITEM_PER_PAGE));
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>(transactions);
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    const searchResult = transactions // Info: (20231103 - Julian) filter by search term
      .filter((transaction: ITransaction) => {
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
      }) // Info: (20231103 - Julian) filter by date range
      .filter((transaction: ITransaction) => {
        const createdTimestamp = transaction.createdTimestamp;
        const start = period.startTimeStamp;
        const end = period.endTimeStamp;
        // Info: (20231103 - Julian) if start and end are 0, it means that there is no period filter
        const isCreatedTimestampInRange =
          start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
        return isCreatedTimestampInRange;
      })
      .sort((a: ITransaction, b: ITransaction) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231103 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231103 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });

    setFilteredTransactions(searchResult);
    setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
    setActivePage(1);
  }, [search, sorting, period]);

  // Info: (20231103 - Julian) Pagination
  const transactionList = filteredTransactions.slice(startIdx, endIdx).map((transaction, index) => {
    const {id, chainId, createdTimestamp, status} = transaction;
    const transactionLink = getDynamicUrl(chainId, `${id}`).TRANSACTION;

    const createdStr = timestampToString(createdTimestamp);
    // Info: (20231103 - Julian) If month is longer than 3 letters, slice it and add a dot
    const monthStr =
      t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

    const statusStyle =
      status === 'PROCESSING'
        ? {
            str: t('CHAIN_DETAIL_PAGE.STATUS_PROCESSING'),
            icon: '/animations/trade_processing.gif',
            style: 'text-hoverWhite',
          }
        : status === 'SUCCESS'
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
      // Info: (20231103 - Julian) Transaction History Item
      <div key={index} className="flex h-60px w-full items-center">
        {/* Info: (20231103 - Julian) Create Time square */}
        <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-purpleLinear">
          <p className="text-xl">{createdStr.day}</p>
          <p className="text-xs">{monthStr}</p>
          <p className="text-xs text-lilac">{createdStr.time}</p>
        </div>
        <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
          {/* Info: (20231103 - Julian) Transaction ID & Type */}
          <Link href={transactionLink} className="inline-flex flex-1 items-baseline space-x-2">
            <h2 className="text-sm lg:text-xl">
              {t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB')}{' '}
              <span className="text-primaryBlue">{id}</span>
            </h2>
          </Link>
          {/* Info: (20231103 - Julian) Status */}
          <div className="flex items-center space-x-2 px-2">
            <Image src={statusStyle.icon} width={16} height={16} alt={`${statusStyle.str}_icon`} />
            <p className={`hidden text-sm lg:block ${statusStyle.style}`}>{statusStyle.str}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231103 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.TRANSACTION_HISTORY_TITLE')} ({transactions.length})
      </h2>
      <div className="flex w-full flex-col bg-darkPurple p-4 lg:h-950px">
        {/* Info: (20231103 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end space-y-4">
          <div className="flex w-full flex-col items-center justify-between lg:flex-row">
            {/* Info: (20231101 - Julian) Date Picker */}
            <div className="flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
              <DatePicker setFilteredPeriod={setPeriod} isLinearBg />
            </div>
            {/* Info: (20231103 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sortingOptions={sortOldAndNewOptions}
                sorting={sorting}
                setSorting={setSorting}
                isLinearBg
              />
            </div>
          </div>
          {/* Info: (20231103 - Julian) Search Bar */}
          <SearchBar
            searchBarPlaceholder={t('COMMON.TRANSACTION_HISTORY_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        {/* Info: (20231103 - Julian) Address List */}
        <div className="my-10 flex w-full flex-1 flex-col">{transactionList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default TransactionHistorySection;