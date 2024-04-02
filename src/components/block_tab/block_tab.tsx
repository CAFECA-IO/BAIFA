import {Dispatch, SetStateAction, useState} from 'react';
import {useRouter} from 'next/router';
import BlockList from '../block_list/block_list';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IBlockList} from '../../interfaces/block';
import DatePicker from '../date_picker/date_picker';
import {SearchBarWithKeyDown} from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {sortOldAndNewOptions, default30DayPeriod, ITEM_PER_PAGE} from '../../constants/config';
import Pagination from '../pagination/pagination';
import Skeleton from '../skeleton/skeleton';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../constants/api_request';
import {ChainDetailTab} from '../../interfaces/chain';
import {convertStringToSortingType} from '../../lib/common';

interface IBlockTabProps {
  chainDetailLoading: boolean;
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
}

const BlockTab = ({chainDetailLoading, activePage, setActivePage}: IBlockTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20240119 - Julian) get chainId from URL
  const router = useRouter();
  const chainId = router.query.chainId as string;

  // Info: (20240220 - Julian) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  const {data: blockData, isLoading: isBlockLoading} = useAPIResponse<IBlockList>(
    `${APIURL.CHAINS}/${chainId}/block`,
    {method: HttpMethod.GET},
    {
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
      sort: convertStringToSortingType(sorting),
      page: activePage,
    }
  );

  const {blocks, totalPages} = blockData ?? {blocks: [], totalPages: 0};

  // Info: (20240206 - Julian) Loading animation
  const skeletonBlockList = (
    <div className="flex h-680px w-full flex-col py-10">
      {Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <div
          key={index}
          className="flex h-60px w-full items-center gap-8 border-b border-darkPurple4 px-1"
        >
          <Skeleton width={50} height={50} />
          <Skeleton width={150} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  );

  const isShowBlockList =
    // Info: (20240220 - Julian) BlockTab 和 ChainDetailPage 都完成 Loading 後才顯示 BlockList
    isBlockLoading || chainDetailLoading ? skeletonBlockList : <BlockList blockData={blocks} />;

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20231101 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20231101 - Julian) Search Bar */}
        <div className="w-full lg:w-7/10">
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_BLOCKS'),
            setSearch: setSearch,
            setActivePage: setActivePage,
          })}
        </div>
        <div className="flex w-full flex-col items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Info: (20231101 - Julian) Date Picker */}
          <div className="flex w-full items-center text-base lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker
              period={period}
              setFilteredPeriod={setPeriod}
              setActivePage={setActivePage}
            />
          </div>
          {/* Info: (20230904 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
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
      {/* Info: (20230904 - Julian) Block List */}
      <div className="flex w-full flex-col items-center">
        {isShowBlockList}
        <Pagination
          pagePrefix={ChainDetailTab.BLOCKS}
          activePage={activePage}
          setActivePage={setActivePage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default BlockTab;
