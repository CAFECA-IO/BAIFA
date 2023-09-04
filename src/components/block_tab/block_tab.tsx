import {useState} from 'react';
import useStateRef from 'react-usestateref';
import useOuterClick from '../../lib/hooks/use_outer_click';
import DatePicker from '../date_picker/date_picker';
import BlockItem from '../block_item/block_item';
import {FaChevronDown} from 'react-icons/fa';
import {RiSearchLine} from 'react-icons/ri';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {dummyBlockData, IBlockData} from '../../interfaces/block_data';

const BlockTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // ToDo: (20230904 - Julian) filter
  const [search, setSearch, searchRef] = useStateRef('');
  const [filteredPeriod, setFilteredPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  const [sorting, setSorting] = useState<'Newest' | 'Oldest'>('Newest');

  /* Info: (20230904 - Julian) close sorting menu when click outer */
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLUListElement>(false);

  const newestSortClickHandler = () => {
    setSorting('Newest');
    setSortingVisible(false);
  };

  const oldestSortClickHandler = () => {
    setSorting('Oldest');
    setSortingVisible(false);
  };

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
  };

  const blockList = dummyBlockData.map((block, index) => <BlockItem key={index} block={block} />);

  const sortingMenu = (
    <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
      <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
      <button
        onClick={() => setSortingVisible(!sortingVisible)}
        className="flex w-full items-center space-x-4 rounded bg-darkPurple px-6 py-4 text-hoverWhite lg:w-140px"
      >
        <p
          className={`flex-1 text-left lg:w-60px ${
            sortingVisible ? 'opacity-0' : 'opacity-100'
          } transition-all duration-300 ease-in-out`}
        >
          {sorting === 'Newest' ? t('SORTING.NEWEST') : t('SORTING.OLDEST')}
        </p>
        <FaChevronDown />
      </button>
      <ul
        ref={sortingRef}
        className={`absolute right-0 z-10 grid w-full grid-cols-1 items-center overflow-hidden lg:w-140px ${
          sortingVisible
            ? 'visible translate-y-90px grid-rows-1 opacity-100'
            : 'invisible translate-y-12 grid-rows-0 opacity-0'
        } rounded bg-darkPurple2 text-left text-hoverWhite shadow-xl transition-all duration-300 ease-in-out`}
      >
        <li
          onClick={newestSortClickHandler}
          className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
        >
          {t('SORTING.NEWEST')}
        </li>
        <li
          onClick={oldestSortClickHandler}
          className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
        >
          {t('SORTING.OLDEST')}
        </li>
      </ul>
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20230904 - Julian) Search Bar */}
      <div className="relative flex w-full items-center justify-center drop-shadow-xl lg:w-7/10">
        <input
          type="search"
          className="w-full items-center rounded-full bg-purpleLinear px-6 py-3 text-base"
          placeholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_BLOCKS')}
          onChange={searchChangeHandler}
        />
        <div className="absolute right-4 text-2xl font-bold hover:cursor-pointer">
          <RiSearchLine />
        </div>
      </div>
      <div className="flex w-full flex-col-reverse items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
        {/* Info: (20230904 - Julian) Date Picker */}
        <div className="flex w-full items-center text-base lg:w-fit lg:space-x-2">
          <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
          <DatePicker setFilteredPeriod={setFilteredPeriod} />
        </div>

        {/* Info: (20230904 - Julian) Sorting Menu */}
        {sortingMenu}
      </div>
      {/* Info: (20230904 - Julian) Block List */}
      <div className="flex w-full flex-col items-center py-10">{blockList}</div>
    </div>
  );
};

export default BlockTab;
