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
import {SkeletonList} from '../skeleton/skeleton';
import {IDatePeriod} from '../../interfaces/date_period';

export enum TransactionDataType {
  ADDRESS_DETAILS = 'ADDRESS_DETAILS',
}

interface ITransactionHistorySectionProps {
  // Info: (20240226 - Julian) transaction history list
  transactions: IDisplayTransaction[];

  dataType?: TransactionDataType;

  period?: IDatePeriod;
  setPeriod?: Dispatch<SetStateAction<IDatePeriod>>;
  sorting?: string;
  setSorting?: Dispatch<SetStateAction<string>>;

  suggestions?: string[];
  setSearch?: Dispatch<SetStateAction<string>>;
  activePage?: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;

  totalPage?: number;
  transactionCount?: number;
}

const TransactionHistorySection = ({
  transactions,
  dataType,
  period,
  setPeriod,
  sorting,
  setSorting,

  suggestions,
  setSearch,
  activePage,
  setActivePage,
  isLoading,
  totalPage,
  transactionCount,
}: ITransactionHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const addressDetailsCtx = useContext(AddressDetailsContext);
  const defaultPages =
    dataType === TransactionDataType.ADDRESS_DETAILS
      ? addressDetailsCtx.transactions.totalPage
      : Math.ceil(1 / ITEM_PER_PAGE);

  const [activePageDefault, setActivePageDefault] = useState(1);
  const totalPagesDefault = totalPage ?? defaultPages;

  const [searchDefault, setSearchDefault] = useState('');
  const [sortingDefault, setSortingDefault] = useState<string>(sortOldAndNewOptions[0]);
  const [periodDefault, setPeriodDefault] = useState(default30DayPeriod);

  const isLoadingDefault = isLoading ?? false;

  const transactionCountDefault = transactionCount ?? transactions.length;

  // Info: (20231113 - Julian) Pagination
  const transactionList =
    transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <TransactionHistoryItem key={index} transaction={transaction} />
      ))
    ) : (
      <h2 className="text-center">{t('COMMON.NO_DATA')}</h2>
    );

  const displayedTransactionList = isLoadingDefault ? (
    <SkeletonList count={ITEM_PER_PAGE} />
  ) : (
    transactionList
  );

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231113 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.TRANSACTION_HISTORY_TITLE')} ({transactionCountDefault})
      </h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple px-6 py-4 drop-shadow-xl lg:h-1050px">
        {/* Info: (20231113 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end gap-4">
          <div className="flex w-full flex-col items-start justify-between lg:flex-row">
            {/* Info: (20240221 - Julian) Date Picker */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
              <DatePicker
                period={period ?? periodDefault}
                setFilteredPeriod={setPeriod ?? setPeriodDefault}
                isLinearBg
              />
            </div>
            {/* Info: (20231113 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sortingOptions={sortOldAndNewOptions}
                sorting={sorting ?? sortingDefault}
                setSorting={setSorting ?? setSortingDefault}
                bgColor="bg-purpleLinear"
                sortPrefix={`transaction`}
              />
            </div>
          </div>
          {/* Info: (20231113 - Julian) Search Bar */}
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('COMMON.TRANSACTION_HISTORY_PLACEHOLDER'),
            setSearch: setSearch ?? setSearchDefault,
            suggestions: suggestions,
          })}
        </div>
        {/* Info: (20231113 - Julian) To Address List */}
        <div className="my-10 flex w-full flex-1 flex-col">{displayedTransactionList}</div>
        <Pagination
          pagePrefix={`transaction`}
          activePage={activePage ?? activePageDefault}
          setActivePage={setActivePage ?? setActivePageDefault}
          totalPages={totalPagesDefault}
        />
      </div>
    </div>
  );
};

export default TransactionHistorySection;
