import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import SearchBar from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'react-i18next';
import {ITEM_PER_PAGE, sortOldAndNewOptions} from '../../constants/config';
import {getChainIcon, roundToDecimal, timestampToString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';
import DatePicker from '../date_picker/date_picker';
import {IBlock} from '../../interfaces/block';

interface IBlockProducedHistorySectionProps {
  blocks: IBlock[];
  unit: string;
}

const BlockProducedHistorySection = ({blocks, unit}: IBlockProducedHistorySectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(1 / ITEM_PER_PAGE));
  const [filteredBlocks, setFilteredBlocks] = useState<IBlock[]>(blocks);
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    const searchResult = blocks // Info: (20231103 - Julian) filter by search term
      .filter((block: IBlock) => {
        const searchTerm = searchRef.current.toLowerCase();
        const managementTeam = block.managementTeam.map(team => team.toLowerCase());
        const stabilityLevel = block.stabilityLevel.toLowerCase();
        const transactions = block.transactions.toString().toLowerCase();
        const miner = block.miner.toString().toLowerCase();
        return searchTerm !== ''
          ? block.id.toString().includes(searchTerm) ||
              managementTeam.includes(searchTerm) ||
              stabilityLevel.includes(searchTerm) ||
              transactions.toString().includes(searchTerm) ||
              miner.toString().includes(searchTerm)
          : true;
      })
      // Info: (20231103 - Julian) filter by date range
      .filter((block: IBlock) => {
        const createdTimestamp = block.createdTimestamp;
        const start = period.startTimeStamp;
        const end = period.endTimeStamp;
        // Info: (20231103 - Julian) if start and end are 0, it means that there is no period filter
        const isCreatedTimestampInRange =
          start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
        return isCreatedTimestampInRange;
      })
      .sort((a: IBlock, b: IBlock) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231101 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231101 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredBlocks(searchResult);
    setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
    setActivePage(1);
  }, [search, sorting, period]);

  // Info: (20231103 - Julian) Pagination
  const blockList = filteredBlocks.slice(startIdx, endIdx).map(block => {
    const {id, chainId, createdTimestamp, reward} = block;
    const icon = getChainIcon(chainId);

    const createdStr = timestampToString(createdTimestamp);
    // Info: (20231103 - Julian) If month is longer than 3 letters, slice it and add a dot
    const monthStr =
      t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

    const blockLink = getDynamicUrl(chainId, `${id}`).BLOCK;

    return (
      <div className="flex h-60px w-full items-center">
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
              {t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')} <span className="text-primaryBlue">{id}</span>
            </h2>
          </Link>
          {/* Info: (20231103 - Julian) Mine */}
          <div className="flex items-center space-x-2">
            <Image src={icon.src} width={24} height={24} alt={icon.alt} />
            <p className="tex-sm">
              +{roundToDecimal(reward, 2)} {unit}
            </p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Info: (20231103 - Julian) Title */}
      <h2 className="text-xl text-lilac">
        {t('COMMON.BLOCK_PRODUCED_HISTORY_TITLE')} ({blocks.length})
      </h2>
      <div className="flex h-950px w-full flex-col bg-darkPurple p-4">
        {/* Info: (20231103 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end space-y-4">
          <div className="flex w-full items-center justify-between">
            {/* Info: (20231101 - Julian) Date Picker */}
            <div className="flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
              <DatePicker setFilteredPeriod={setPeriod} isLinearBg />
            </div>
            {/* Info: (20231103 - Julian) Sorting Menu */}
            <div className="relative flex w-full flex-col items-start space-y-2 text-base lg:w-fit">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sortingOptions={sortOldAndNewOptions}
                sorting={sorting}
                setSorting={setSorting}
                isLinearBg
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
        <div className="my-10 flex w-full flex-1 flex-col space-y-2 lg:space-y-0">{blockList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default BlockProducedHistorySection;
