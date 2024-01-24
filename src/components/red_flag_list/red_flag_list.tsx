import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import {ITEM_PER_PAGE, default30DayPeriod, sortOldAndNewOptions} from '../../constants/config';
import Pagination from '../../components/pagination/pagination';
import SearchBar from '../../components/search_bar/search_bar';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import DatePicker from '../../components/date_picker/date_picker';
import RedFlagItem from '../../components/red_flag_item/red_flag_item';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IRedFlag} from '../../interfaces/red_flag';

interface IRedFlagListProps {
  redFlagData: IRedFlag[];
}

const RedFlagList = ({redFlagData}: IRedFlagListProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20231109 - Julian) Type Options
  const flaggingType = redFlagData.map(redFlagData => redFlagData.redFlagType);
  const typeOptions = ['SORTING.ALL', ...flaggingType];

  // Info: (20231109 - Julian) States
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState(default30DayPeriod);
  const [filteredType, setFilteredType] = useState<string>(typeOptions[0]);
  const [filteredRedFlagList, setFilteredRedFlagList] = useState<IRedFlag[]>(redFlagData);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(redFlagData.length / ITEM_PER_PAGE)
  );

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  const displayRedFlagList = filteredRedFlagList
    // Info: (20231109 - Julian) pagination
    .slice(startIdx, endIdx)
    .map((redFlagData, index) => <RedFlagItem key={index} redFlagData={redFlagData} />);

  useEffect(() => {
    const searchResult = redFlagData
      // Info: (20231109 - Julian) filter by search term
      .filter((redFlagData: IRedFlag) => {
        const searchTerm = searchRef.current.toLowerCase();
        const type = redFlagData.redFlagType.toLowerCase();
        const addressId = redFlagData.addressId.toLowerCase();
        const id = redFlagData.id.toLowerCase();

        return searchTerm !== ''
          ? type.includes(searchTerm) || addressId.includes(searchTerm) || id.includes(searchTerm)
          : true;
      })
      // Info: (20231109 - Julian) filter by date range
      // .filter((redFlagData: IRedFlag) => {
      //   const createdTimestamp = redFlagData.createdTimestamp;
      //   const start = period.startTimeStamp;
      //   const end = period.endTimeStamp;
      //   // Info: (20231109 - Julian) if start and end are 0, it means that there is no period filter
      //   const isCreatedTimestampInRange =
      //     start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
      //   return isCreatedTimestampInRange;
      // })
      // Info: (20231109 - Julian) filter by type
      .filter((redFlagData: IRedFlag) => {
        const type = redFlagData.redFlagType.toLowerCase();
        return filteredType !== typeOptions[0] ? filteredType.toLowerCase().includes(type) : true;
      })
      // Info: (20231109 - Julian) sort by Newest or Oldest
      .sort((a: IRedFlag, b: IRedFlag) => {
        return sorting === sortOldAndNewOptions[0]
          ? a.createdTimestamp - b.createdTimestamp
          : b.createdTimestamp - a.createdTimestamp;
      });

    setFilteredRedFlagList(searchResult);
    setActivePage(1);
    setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
  }, [redFlagData, filteredType, search, period, sorting]);

  return (
    <>
      {/* Info: (20231109 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-end space-y-10">
        {/* Info: (20231109 - Julian) Search Bar */}
        <div className="mx-auto my-5 w-full lg:w-7/10">
          <SearchBar
            searchBarPlaceholder={t('RED_FLAG_DETAIL_PAGE.SEARCH_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:h-72px lg:flex-row lg:justify-between">
          {/* Info: (20231109 - Julian) Type Select Menu */}
          <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
            <SortingMenu
              sortingOptions={typeOptions}
              sorting={filteredType}
              setSorting={setFilteredType}
              bgColor="bg-darkPurple"
            />
          </div>
          {/* Info: (20231109 - Julian) Date Picker */}
          <div className="flex w-full items-center text-sm lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker period={period} setFilteredPeriod={setPeriod} />
          </div>
          {/* Info: (20231109 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center text-sm lg:w-fit lg:space-x-2">
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

      {/* Info: (20231109 - Julian) Red Flag List */}
      <div className="mt-10 flex w-full flex-col items-center space-y-10">
        <div className="flex w-full flex-col">{displayRedFlagList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </>
  );
};

export default RedFlagList;
