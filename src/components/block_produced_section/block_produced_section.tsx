import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useContext} from 'react';
import useStateRef from 'react-usestateref';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {
  DEFAULT_CHAIN_ICON,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../constants/config';
import {
  convertSortingTypeToString,
  getChainIcon,
  roundToDecimal,
  timestampToString,
} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';
import DatePicker from '../date_picker/date_picker';
import {IProductionBlock} from '../../interfaces/block';
import {IPaginationOptions, SortingType} from '../../constants/api_request';
import {AddressDetailsContext} from '../../contexts/address_details_context';

interface IBlockProducedHistorySectionProps {
  blocks: IProductionBlock[];
  totalBlocks: number;
}

const blockItemSkeleton = (
  <div className="flex items-center justify-between">
    <div>
      <div className="mb-2.5 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
  </div>
);

const blockListSkeleton = (
  <div
    role="status"
    className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
  >
    {/* Info: generate 10 skeletons (20240207 - Shirley) */}
    {Array.from({length: 10}, (_, index) => (
      <div key={index} className={`${index !== 0 ? `pt-4` : ``}`}>
        {blockItemSkeleton}
      </div>
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);

const BlockProducedHistorySection = ({}: IBlockProducedHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const addressDetailsCtx = useContext(AddressDetailsContext);

  const [activePage, setActivePage, activePageRef] = useStateRef(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(addressDetailsCtx.producedBlocks.blockCount / ITEM_PER_PAGE)
  );
  const [filteredBlocks, setFilteredBlocks, filteredBlocksRef] = useStateRef<IProductionBlock[]>(
    addressDetailsCtx.producedBlocks.blockData
  );
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState(default30DayPeriod);

  /* Deprecated: (20240220 - Shirley) 
  // const endIdx = activePage * ITEM_PER_PAGE;
  // const startIdx = endIdx - ITEM_PER_PAGE;

  // const getActivePage = (page: number) => {
  //   console.log('getActivePage', page);
  //   setActivePage(page);
  // };
  */

  useEffect(() => {
    const searchResult = [...addressDetailsCtx.producedBlocks.blockData]; // Info: (20231103 - Julian) filter by search term
    /* TODO: (20240207 - Shirley) filter by search term
    // .filter((block: IProductionBlock) => {
    //   const searchTerm = searchRef.current.toLowerCase();
    //   const stability = block.stability.toLowerCase();

    //   return searchTerm !== ''
    //     ? block.id.toString().includes(searchTerm) || stability.includes(searchTerm)
    //     : true;
    // })
    // // Info: (20231103 - Julian) filter by date range
    // .filter((block: IProductionBlock) => {
    //   const createdTimestamp = block.createdTimestamp;
    //   const start = period.startTimeStamp;
    //   const end = period.endTimeStamp;
    //   // Info: (20231103 - Julian) if start and end are 0, it means that there is no period filter
    //   const isCreatedTimestampInRange =
    //     start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
    //   return isCreatedTimestampInRange;
    // })
    // .sort((a: IProductionBlock, b: IProductionBlock) => {
    //   return sorting === sortOldAndNewOptions[0]
    //     ? // Info: (20231101 - Julian) Newest
    //       b.createdTimestamp - a.createdTimestamp
    //     : // Info: (20231101 - Julian) Oldest
    //       a.createdTimestamp - b.createdTimestamp;
    // });
    
    // setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
    // setActivePage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    */
    setFilteredBlocks(prev => searchResult);
    setTotalPages(Math.floor(addressDetailsCtx.producedBlocks.blockCount / ITEM_PER_PAGE));
  }, [addressDetailsCtx.producedBlocks, search, sorting, period]);

  // Info: (20240103 - Julian) The count of blocks
  const blockCount = addressDetailsCtx.producedBlocks.blockCount;

  // Info: (20231103 - Julian) Pagination
  const blockList =
    filteredBlocksRef.current.length > 0
      ? filteredBlocksRef.current.map(block => {
          const {id, chainId, createdTimestamp, reward, unit} = block;
          const chainIcon = getChainIcon(chainId);

          const createdStr = timestampToString(createdTimestamp);
          // Info: (20231103 - Julian) If month is longer than 3 letters, slice it and add a dot
          const monthStr =
            t(createdStr.month).length > 3
              ? `${t(createdStr.month).slice(0, 3)}.`
              : t(createdStr.month);

          const blockLink = getDynamicUrl(chainId, `${id}`).BLOCK;

          return (
            <div key={block.id} className="flex h-60px w-full items-center">
              {/* Info: (20231103 - Julian) Create Time square */}
              <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-purpleLinear">
                <p className="text-xl">{createdStr.day}</p>
                <p className="text-xs">{monthStr}</p>
                <p className="text-xs text-lilac">{createdStr.time}</p>
              </div>
              <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
                {/* Info: (20231103 - Julian) Block ID */}
                <Link href={blockLink} className="flex-1 text-sm lg:text-xl">
                  <h2>
                    {t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')}{' '}
                    <span className="text-primaryBlue">{id}</span>
                  </h2>
                </Link>
                {/* Info: (20231103 - Julian) Mine */}
                <div className="flex items-center space-x-2">
                  <Image
                    src={chainIcon.src}
                    width={24}
                    height={24}
                    alt={chainIcon.alt}
                    onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                  />
                  <p className="text-sm">
                    +{roundToDecimal(reward, 2)}
                    {unit}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      : [];

  const displayedBlocks = <>{addressDetailsCtx.blocksLoading ? blockListSkeleton : blockList}</>;

  const blockPaginationHandler = async ({page, offset}: {page: number; offset: number}) => {
    addressDetailsCtx.clickBlockPagination({
      page,
      offset: offset,
      order: addressDetailsCtx.blocksOrder,
    });
  };

  const blockSortingHandler = async ({order}: {order: SortingType}) => {
    addressDetailsCtx.clickBlockSortingMenu(order);
  };

  const blockDateFilterHandler = async (start: number, end: number) => {
    addressDetailsCtx.clickBlockDatePicker(start, end);
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231103 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.BLOCK_PRODUCED_HISTORY_TITLE')} ({blockCount})
      </h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple p-4 drop-shadow-xl lg:h-1050px">
        {/* Info: (20231103 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end gap-4">
          <div className="flex w-full flex-col items-start justify-between xl:flex-row">
            {/* Info: (20231101 - Julian) Date Picker */}
            <div className="flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
              <DatePicker
                period={period}
                setFilteredPeriod={setPeriod}
                isLinearBg
                loading={addressDetailsCtx.blocksLoading}
                datePickerHandler={blockDateFilterHandler}
              />
            </div>
            {/* Info: (20231103 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sorting={sorting}
                setSorting={setSorting}
                bgColor="bg-purpleLinear"
                sortingHandler={blockSortingHandler}
                sortingOptions={sortOldAndNewOptions}
                loading={addressDetailsCtx.blocksLoading}
              />
            </div>
          </div>
          {/* Info: (20231103 - Julian) Search Bar */}
          <SearchBar
            searchBarPlaceholder={t('COMMON.BLOCK_PRODUCED_HISTORY_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        {/* Info: (20231103 - Julian) Address List */}
        <div className="my-10 flex w-full flex-1 flex-col">{displayedBlocks}</div>
        <Pagination
          paginationClickHandler={blockPaginationHandler}
          loading={addressDetailsCtx.blocksLoading}
          pagePrefix={`block_produced`}
          // getActivePage={getActivePage}
          activePage={activePage}
          setActivePage={setActivePage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default BlockProducedHistorySection;
