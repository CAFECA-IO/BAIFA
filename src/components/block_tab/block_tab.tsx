import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import useStateRef from 'react-usestateref';
import BlockList from '../block_list/block_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IBlock} from '../../interfaces/block';
import DatePicker from '../date_picker/date_picker';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {sortOldAndNewOptions, default30DayPeriod} from '../../constants/config';
import {MarketContext} from '../../contexts/market_context';
import Pagination from '../pagination/pagination';

const BlockTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {getBlocks} = useContext(MarketContext);

  // Info: (20240119 - Julian) get chainId from URL
  const router = useRouter();
  const chainId = router.query.chainId as string;

  const totalPages = 100; // ToDo: (20240119 - Julian) 如何從 API 取得總頁數？
  const [activePage, setActivePage] = useState(1);

  const [search, setSearch, searchRef] = useStateRef('');
  const [period, setPeriod] = useState(default30DayPeriod);
  const [blockData, setBlockData] = useState<IBlock[]>([]);

  // Info: (20240119 - Julian) 設定 API 查詢參數
  const dateQuery =
    period.startTimeStamp === 0 || period.endTimeStamp === 0
      ? ''
      : `&start_date=${period.startTimeStamp}&end_date=${period.endTimeStamp}`;
  const pageQuery = `page=${activePage}`;

  const apiQueryStr = `${pageQuery}${dateQuery}`;

  // Info: (20240119 - Julian) Call API to get block data
  const getBlockData = async () => {
    const data = await getBlocks(chainId, apiQueryStr);
    setBlockData(data);
  };

  useEffect(() => {
    if (blockData.length === 0) getBlockData();
  }, []);

  useEffect(() => {
    getBlockData();
  }, [period, activePage, chainId]);

  // Info: (20240119 - Julian) 關鍵字搜尋 & 排序
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredBlockData, setFilteredBlockData] = useState<IBlock[]>(blockData);

  useEffect(() => {
    const searchResult = blockData
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
  }, [blockData, search, sorting]);

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
      <div className="flex w-full flex-col items-center">
        <BlockList blockData={filteredBlockData} />
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default BlockTab;
