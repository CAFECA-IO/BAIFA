import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import useStateRef from 'react-usestateref';
import BlockList from '../block_list/block_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IBlock, IBlockList} from '../../interfaces/block';
import DatePicker from '../date_picker/date_picker';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {sortOldAndNewOptions, default30DayPeriod} from '../../constants/config';
import {MarketContext} from '../../contexts/market_context';
import Pagination from '../pagination/pagination';
import Skeleton from '../skeleton/skeleton';

const BlockTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {getBlockList} = useContext(MarketContext);

  // Info: (20240119 - Julian) get chainId from URL
  const router = useRouter();
  const chainId = router.query.chainId as string;

  const [search, setSearch, searchRef] = useStateRef('');
  const [period, setPeriod] = useState(default30DayPeriod);
  const [blockList, setBlockList] = useState<IBlockList>();
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);

  // Info: (20240119 - Julian) 設定 API 查詢參數
  const dateQuery =
    period.startTimeStamp === 0 || period.endTimeStamp === 0
      ? ''
      : `&start_date=${period.startTimeStamp}&end_date=${period.endTimeStamp}`;
  const pageQuery = `page=${activePage}`;

  const apiQueryStr = `${pageQuery}${dateQuery}`;

  // Info: (20240119 - Julian) Call API to get block data
  const getBlockData = async () => {
    const data = await getBlockList(chainId, apiQueryStr);
    setBlockList(data);
  };

  useEffect(() => {
    // Info: (20240217 - Julian) Loading animation
    setIsLoading(true);

    // Info: (20240217 - Julian) 如果拿到資料，就將 isLoading 設為 false
    if (blockList?.blocks && blockList?.blocks.length > 0) {
      setIsLoading(false);
    }

    // Info: (20240217 - Julian) 如果 3 秒後還沒拿到資料，也將 isLoading 設為 false
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, blockList]);

  useEffect(() => {
    setActivePage(1);
    getBlockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, chainId]);

  useEffect(() => {
    getBlockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const {blocks, totalPages} = blockList ?? {blocks: [], totalPages: 0};

  // Info: (20240119 - Julian) 關鍵字搜尋 & 排序
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredBlockData, setFilteredBlockData] = useState<IBlock[]>(blocks);

  useEffect(() => {
    const searchResult = blocks
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockList, search, sorting]);

  const displayBlockList = isLoading ? (
    // Info: (20240206 - Julian) Loading animation
    <div className="flex w-full flex-col py-10 divide-y divide-darkPurple4">
      {Array.from({length: 3}).map((_, index) => (
        <div key={index} className="flex w-full items-center gap-5 py-2">
          <Skeleton width={60} height={60} />
          <div className="flex-1">
            <Skeleton width={100} height={20} />
          </div>
          <Skeleton width={100} height={20} />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-col items-center">
      <BlockList blockData={filteredBlockData} />
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </div>
  );

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
      {displayBlockList}
    </div>
  );
};

export default BlockTab;
