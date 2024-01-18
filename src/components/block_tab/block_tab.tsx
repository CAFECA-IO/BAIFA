import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import useStateRef from 'react-usestateref';
import BlockList from '../block_list/block_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IBlock} from '../../interfaces/block';
import DatePicker from '../date_picker/date_picker';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {sortOldAndNewOptions, default30DayPeriod} from '../../constants/config';
import {IDatePeriod} from '../../interfaces/date_period';

interface IBlockTabProps {
  datePeriod?: IDatePeriod;
  setDatePeriod?: Dispatch<SetStateAction<IDatePeriod>>;
  blockList: IBlock[];
}

const BlockTab = ({datePeriod, setDatePeriod, blockList}: IBlockTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [search, setSearch, searchRef] = useStateRef('');
  const [period, setPeriod] =
    typeof datePeriod !== 'object' || typeof setDatePeriod !== 'function'
      ? // Info: (20240102 - Julian) if datePeriod and setDatePeriod are not provided, use default30DayPeriod
        useState(default30DayPeriod)
      : [datePeriod, setDatePeriod];
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredBlockData, setFilteredBlockData] = useState<IBlock[]>(blockList);

  useEffect(() => {
    const searchResult = blockList
      // Info: (20230905 - Julian) filter by date range
      // .filter((block: IBlock) => {
      //   const createdTimestamp = block.createdTimestamp;
      //   const start = period.startTimeStamp;
      //   const end = period.endTimeStamp;
      //   // Info: (20230905 - Julian) if start and end are 0, it means that there is no period filter
      //   const isCreatedTimestampInRange =
      //     start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
      //   return isCreatedTimestampInRange;
      // })
      // Info: (20230905 - Julian) filter by search term
      .filter((block: IBlock) => {
        const searchTerm = searchRef.current.toLowerCase();
        const stability = block.stability ? block.stability.toLowerCase() : 'low'; // ToDo: (20240116 - Julian) remove this after API is fixed

        return searchTerm !== ''
          ? block.id.toString().includes(searchTerm) || stability.includes(searchTerm)
          : true;
      })
      .sort((a: IBlock, b: IBlock) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231101 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231101 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredBlockData(searchResult);
  }, [period, search, sorting]);

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20231101 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20231101 - Julian) Search Bar */}
        <div className="w-full lg:w-7/10">
          <SearchBar
            searchBarPlaceholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_BLOCKS')}
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
      {/* Info: (20230904 - Julian) Block List */}
      <BlockList blockData={filteredBlockData} />
    </div>
  );
};

export default BlockTab;
