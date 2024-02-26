import {useState, useContext, Dispatch, SetStateAction} from 'react';
import {SearchBarWithKeyDown} from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {ITEM_PER_PAGE, sortOldAndNewOptions, default30DayPeriod} from '../../constants/config';
import TransactionHistoryItem from '../transaction_history_item/transaction_history_item';
import Pagination from '../pagination/pagination';
import {IDisplayTransaction} from '../../interfaces/transaction';
import DatePicker from '../date_picker/date_picker';
import {AddressDetailsContext} from '../../contexts/address_details_context';
import {SortingType} from '../../constants/api_request';
import {SkeletonList} from '../skeleton/skeleton';

export enum TransactionDataType {
  ADDRESS_DETAILS = 'ADDRESS_DETAILS',
}

interface ITransactionHistorySectionProps {
  // Info: (20240226 - Julian) transaction history list
  transactions: IDisplayTransaction[];

  dataType?: TransactionDataType;

  periodInherit?: {startTimeStamp: number; endTimeStamp: number};
  setPeriodInherit?: Dispatch<SetStateAction<{startTimeStamp: number; endTimeStamp: number}>>;
  sortingInherit?: string;
  setSortingInherit?: Dispatch<SetStateAction<string>>;
  //searchInherit?: string;
  setSearchInherit?: Dispatch<SetStateAction<string>>;
  activePageInherit?: number;
  setActivePageInherit?: Dispatch<SetStateAction<number>>;
  isLoadingInherit?: boolean;
  //setLoadingInherit?: Dispatch<SetStateAction<boolean>>;

  totalPageInherit?: number;
  transactionCountInherit?: number;
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

// const listSkeleton = (
//   <div
//     role="status"
//     className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow md:p-6 dark:divide-gray-700 dark:border-gray-700"
//   >
//     {/* Info: generate 10 skeletons (20240207 - Shirley) */}
//     {Array.from({length: ITEM_PER_PAGE}, (_, index) => (
//       <div key={index} className={`${index !== 0 ? `pt-4` : ``}`}>
//         {itemSkeleton}
//       </div>
//     ))}
//     <span className="sr-only">Loading...</span>
//   </div>
// );

const TransactionHistorySection = ({
  transactions,
  dataType,
  periodInherit,
  setPeriodInherit,
  sortingInherit,
  setSortingInherit,
  //searchInherit,
  setSearchInherit,
  activePageInherit,
  setActivePageInherit,
  isLoadingInherit,
  //setLoadingInherit,
  totalPageInherit,
  transactionCountInherit,
}: ITransactionHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const addressDetailsCtx = useContext(AddressDetailsContext);
  const defaultPages =
    dataType === TransactionDataType.ADDRESS_DETAILS
      ? addressDetailsCtx.transactions.totalPage
      : Math.ceil(1 / ITEM_PER_PAGE);

  const [activePage, setActivePage] = useState(1);
  const totalPages = totalPageInherit ?? defaultPages;

  const [_, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState(default30DayPeriod);

  const isLoading = isLoadingInherit ?? false;

  const transactionCount = transactionCountInherit ?? transactions.length;

  // const transactionData =
  //   dataType === TransactionDataType.ADDRESS_DETAILS ? addressDetailsCtx.transactions : null;

  // const [filteredTransactions, setFilteredTransactions] = useState<IDisplayTransaction[]>(
  //   transactionData?.transactions ?? transactions
  // );

  // Info: (20231113 - Julian) Pagination
  const transactionList =
    transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <TransactionHistoryItem key={index} transaction={transaction} />
      ))
    ) : (
      <h2 className="text-center">{t('COMMON.NO_DATA')}</h2>
    );

  // const displayedAddressTransactions = !addressDetailsCtx.transactionsLoading ? (
  //   transactionList
  // ) : (
  //   <SkeletonList count={ITEM_PER_PAGE} />
  // );

  const displayedTransactionList = isLoading ? (
    <SkeletonList count={ITEM_PER_PAGE} />
  ) : (
    transactionList
  );

  const paginationClickHandler = async ({page, offset}: {page: number; offset: number}) => {
    if (dataType === TransactionDataType.ADDRESS_DETAILS) {
      await addressDetailsCtx.clickTransactionPagination({
        page,
        offset,
        order: addressDetailsCtx.transactionsOrder,
      });
    }
    // Info: (20240216 - Shirley) default case
    return Promise.resolve();
  };

  const sortingClickHandler = async ({order}: {order: SortingType}) => {
    if (dataType === TransactionDataType.ADDRESS_DETAILS) {
      await addressDetailsCtx.clickTransactionSortingMenu(order);
    }
    // Info: (20240216 - Shirley) default case
    return Promise.resolve();
  };

  const transactionInit = async () => {
    if (dataType === TransactionDataType.ADDRESS_DETAILS) {
      await addressDetailsCtx.transactionInit();
    }
    // Info: (20240216 - Shirley) default case
    return Promise.resolve();
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231113 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.TRANSACTION_HISTORY_TITLE')} ({transactionCount})
      </h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple px-6 py-4 drop-shadow-xl lg:h-1050px">
        {/* Info: (20231113 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end gap-4">
          <div className="flex w-full flex-col items-start justify-between xl:flex-row">
            {/* Info: (20240221 - Julian) Date Picker */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
              <DatePicker
                period={periodInherit ?? period}
                setFilteredPeriod={setPeriodInherit ?? setPeriod}
                isLinearBg
              />
            </div>
            {/* Info: (20231113 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sortingOptions={sortOldAndNewOptions}
                sorting={sortingInherit ?? sorting}
                setSorting={setSortingInherit ?? setSorting}
                bgColor="bg-purpleLinear"
                sortingHandler={sortingClickHandler}
                sortPrefix={`transaction`}
              />
            </div>
          </div>
          {/* Info: (20231113 - Julian) Search Bar */}
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('COMMON.TRANSACTION_HISTORY_PLACEHOLDER'),
            setSearch: setSearchInherit ?? setSearch,
          })}
        </div>
        {/* Info: (20231113 - Julian) To Address List */}
        <div className="my-10 flex w-full flex-1 flex-col">{displayedTransactionList}</div>
        <Pagination
          paginationClickHandler={paginationClickHandler}
          loading={addressDetailsCtx.transactionsLoading}
          pagePrefix={`transaction`}
          activePage={activePageInherit ?? activePage}
          setActivePage={setActivePageInherit ?? setActivePage}
          totalPages={totalPageInherit ?? totalPages}
          pageInit={transactionInit}
        />
      </div>
    </div>
  );
};

export default TransactionHistorySection;
