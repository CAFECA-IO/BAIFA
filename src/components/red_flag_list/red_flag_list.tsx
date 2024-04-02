import {Dispatch, SetStateAction} from 'react';
import {ITEM_PER_PAGE, sortOldAndNewOptions} from '../../constants/config';
import Pagination from '../../components/pagination/pagination';
import {SearchBarWithKeyDown} from '../../components/search_bar/search_bar';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import DatePicker from '../../components/date_picker/date_picker';
import RedFlagItem from '../../components/red_flag_item/red_flag_item';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IRedFlag} from '../../interfaces/red_flag';
import {IDatePeriod} from '../../interfaces/date_period';
import Skeleton from '../skeleton/skeleton';

interface IRedFlagListProps {
  redFlagData: IRedFlag[];

  period: IDatePeriod;
  setPeriod: Dispatch<SetStateAction<IDatePeriod>>;
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;

  setSearch: Dispatch<SetStateAction<string>>;
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  totalPages: number;

  filteredType: string;
  setFilteredType: Dispatch<SetStateAction<string>>;
  typeOptions: string[];
}

const RedFlagListSkeleton = () => {
  const listSkeletons = Array.from({length: ITEM_PER_PAGE}, (_, i) => (
    <div key={i} className="flex w-full flex-col">
      <div className="flex h-60px w-full items-center">
        {/* Info: (20240227 - Shirley) Flagging Time square */}
        <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
          <Skeleton width={60} height={40} />{' '}
        </div>
        <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
          {/* Info: (20240227 - Shirley) Address ID */}
          <Skeleton width={150} height={40} /> {/* Info: (20240227 - Shirley) Flag Type */}
          <div className="flex w-full justify-end">
            <Skeleton width={80} height={40} />{' '}
          </div>
        </div>
      </div>{' '}
    </div>
  ));
  return (
    <>
      {/* Info: (20240227 - Shirley) Red Flag List */}
      <div className="my-16 flex w-full flex-col items-center space-y-0 lg:mt-10">
        {listSkeletons}
      </div>
    </>
  );
};

const RedFlagList = ({
  redFlagData,
  period,
  setPeriod,
  sorting,
  setSorting,
  setSearch,
  activePage,
  setActivePage,
  isLoading,
  totalPages,
  filteredType,
  setFilteredType,
  typeOptions,
}: IRedFlagListProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const isLoadingDefault = isLoading ?? false;

  const redFlagList =
    redFlagData.length > 0 ? (
      redFlagData.map((redFlagData, index) => <RedFlagItem key={index} redFlagData={redFlagData} />)
    ) : (
      <div className="flex w-full flex-col items-center">
        <h2 className="text-center">{t('COMMON.NO_DATA')}</h2>
      </div>
    );

  // Info: (20231109 - Julian) Display Red Flag List Items based on Pagination
  const displayRedFlagList = !isLoadingDefault ? redFlagList : <RedFlagListSkeleton />;

  return (
    <>
      {/* Info: (20231109 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-end space-y-10">
        {/* Info: (20231109 - Julian) Search Bar */}
        <div className="mx-auto my-5 w-full lg:w-7/10">
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('RED_FLAG_DETAIL_PAGE.SEARCH_PLACEHOLDER'),
            setSearch: setSearch,
            setActivePage: setActivePage,
          })}
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:h-72px lg:flex-row lg:justify-between">
          {/* Info: (20231109 - Julian) Type Select Menu */}
          <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
            <SortingMenu
              sortingOptions={typeOptions}
              sorting={filteredType}
              setSorting={setFilteredType}
              bgColor="bg-darkPurple"
              setActivePage={setActivePage}
            />
          </div>
          {/* Info: (20231109 - Julian) Date Picker */}
          <div className="flex w-full items-center text-sm lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker
              period={period}
              setFilteredPeriod={setPeriod}
              setActivePage={setActivePage}
            />
          </div>
          {/* Info: (20231109 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center text-sm lg:w-fit lg:space-x-2">
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

      {/* Info: (20231109 - Julian) Red Flag List */}
      <div className="mt-10 flex w-full flex-col items-center space-y-10">
        <div className="flex min-h-320px w-full flex-col">{displayRedFlagList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </>
  );
};

export default RedFlagList;
