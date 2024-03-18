import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import useStateRef from 'react-usestateref';
import {SearchBarWithKeyDown} from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {
  DEFAULT_CHAIN_ICON,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../constants/config';
import {getChainIcon, roundToDecimal, timestampToString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';
import DatePicker from '../date_picker/date_picker';
import {IProductionBlock} from '../../interfaces/block';
import {SkeletonList} from '../skeleton/skeleton';
import {IDatePeriod} from '../../interfaces/date_period';

interface IBlockProducedHistorySectionProps {
  blocks: IProductionBlock[];
  blockCount: number; // Info: (20240301 - Shirley) The count of blocks

  period?: IDatePeriod;
  setPeriod?: Dispatch<SetStateAction<IDatePeriod>>;
  sorting?: string;
  setSorting?: Dispatch<SetStateAction<string>>;

  setSearch?: Dispatch<SetStateAction<string>>;
  activePage?: number;
  setActivePage?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  totalPages?: number;
}

const BlockProducedHistorySection = ({
  blocks,
  blockCount: blockCount,
  totalPages,
  period,
  setPeriod,
  sorting,
  setSorting,
  setSearch,
  activePage,
  setActivePage,
  isLoading,
}: IBlockProducedHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [activePageDefault, setActivePageDefault] = useStateRef(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchDefault, setSearchDefault, searchRefDefault] = useStateRef('');
  const [sortingDefault, setSortingDefault] = useState<string>(sortOldAndNewOptions[0]);
  const [periodDefault, setPeriodDefault] = useState(default30DayPeriod);

  const isLoadingDefault = isLoading ?? false;

  // Info: (20231103 - Julian) Pagination
  const blockList =
    blocks.length > 0
      ? blocks.map(block => {
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
                    +{roundToDecimal(reward, 2)} {unit}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      : [];

  const displayedBlocks = (
    <>{isLoadingDefault ? <SkeletonList count={ITEM_PER_PAGE} /> : blockList}</>
  );

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231103 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.BLOCK_PRODUCED_HISTORY_TITLE')} ({blockCount})
      </h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple p-4 drop-shadow-xl lg:h-1050px">
        {/* Info: (20231103 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end gap-4">
          <div className="flex w-full flex-col items-start justify-between lg:flex-row">
            {/* Info: (20231101 - Julian) Date Picker */}
            <div className="flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
              <DatePicker
                period={period ?? periodDefault}
                setFilteredPeriod={setPeriod ?? setPeriodDefault}
                isLinearBg
                // loading={addressDetailsCtx.blocksLoading}
                // datePickerHandler={blockDateFilterHandler}
              />
            </div>
            {/* Info: (20231103 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sorting={sorting ?? sortingDefault}
                setSorting={setSorting ?? setSortingDefault}
                bgColor="bg-purpleLinear"
                // sortingHandler={blockSortingHandler}
                sortingOptions={sortOldAndNewOptions}
                // loading={addressDetailsCtx.blocksLoading}
                sortPrefix={`blocks`}
              />
            </div>
          </div>
          {/* Info: (20231103 - Julian) Search Bar */}
          {/* <SearchBar
            searchBarPlaceholder={t('COMMON.BLOCK_PRODUCED_HISTORY_PLACEHOLDER')}
            setSearch={setSearch ?? setSearchDefault}
          /> */}

          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('COMMON.BLOCK_PRODUCED_HISTORY_PLACEHOLDER'),
            setSearch: setSearch ?? setSearchDefault,
          })}
        </div>
        {/* Info: (20231103 - Julian) Address List */}
        <div className="my-10 flex w-full flex-1 flex-col">{displayedBlocks}</div>
        <Pagination
          activePage={activePage ?? activePageDefault}
          setActivePage={setActivePage ?? setActivePageDefault}
          totalPages={totalPages ?? 0}
          // paginationClickHandler={blockPaginationHandler}
          // loading={addressDetailsCtx.blocksLoading}
          pagePrefix={`blocks`}
          // pageInit={blockInit}
        />
      </div>
    </div>
  );
};

export default BlockProducedHistorySection;
