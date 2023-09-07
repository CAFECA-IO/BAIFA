import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import BlockList from '../block_list/block_list';
import SearchFilter from '../search_filter/search_filter';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {dummyBlockData, IBlockData} from '../../interfaces/block_data';

const BlockTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [search, setSearch, searchRef] = useStateRef('');
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  const [sorting, setSorting] = useState<'Newest' | 'Oldest'>('Newest');
  const [filteredBlockData, setFilteredBlockData] = useState<IBlockData[]>(dummyBlockData);

  useEffect(() => {
    const searchResult = dummyBlockData
      // Info: (20230905 - Julian) filter by date range
      .filter((block: IBlockData) => {
        const createdTimestamp = block.createdTimestamp;
        const start = period.startTimeStamp;
        const end = period.endTimeStamp;
        // Info: (20230905 - Julian) if start and end are 0, it means that there is no period filter
        const isCreatedTimestampInRange =
          start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
        return isCreatedTimestampInRange;
      })
      // Info: (20230905 - Julian) filter by search term
      .filter((block: IBlockData) => {
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
      .sort((a: IBlockData, b: IBlockData) => {
        return sorting === 'Newest'
          ? b.createdTimestamp - a.createdTimestamp
          : a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredBlockData(searchResult);
  }, [period, search, sorting]);

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20230907 - Julian) Search Filter */}
      <SearchFilter
        searchBarPlaceholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_BLOCKS')}
        setSearch={setSearch}
        setPeriod={setPeriod}
        sorting={sorting}
        setSorting={setSorting}
      />
      {/* Info: (20230904 - Julian) Block List */}
      <BlockList blockData={filteredBlockData} />
    </div>
  );
};

export default BlockTab;
