import Head from 'next/head';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../contexts/app_context';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';
import {useRouter} from 'next/router';
import NavBar from '../../components/nav_bar/nav_bar';
import Footer from '../../components/footer/footer';
import SearchBar from '../../components/search_bar/search_bar';
import DatePicker from '../../components/date_picker/date_picker';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import SearchingResultItem from '../../components/searching_result_item/searching_result_item';
import Pagination from '../../components/pagination/pagination';
import {sortOldAndNewOptions, ITEM_PER_PAGE, defaultPeriod} from '../../constants/config';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {dummySearchResult, ISearchResult} from '../../interfaces/search_result';

const SearchingResultPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getSearchResult} = useContext(MarketContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  const router = useRouter();
  const {search} = router.query;
  const keyWord = search ? search.toString() : '';

  const headTitle = `${t('SEARCHING_RESULT_PAGE.MAIN_TITLE')} - BAIFA`;
  const filterTabs = [
    'SEARCHING_RESULT_PAGE.ALL_TAB', // All
    'SEARCHING_RESULT_PAGE.BLOCKS_TAB', // Blocks
    'SEARCHING_RESULT_PAGE.ADDRESSES_TAB', // Addresses
    'SEARCHING_RESULT_PAGE.CONTRACTS_TAB', // Contracts
    'SEARCHING_RESULT_PAGE.EVIDENCES_TAB', // Evidences
    'SEARCHING_RESULT_PAGE.TRANSACTIONS_TAB', // Transactions
    'SEARCHING_RESULT_PAGE.BLACKLIST_TAB', // Black List
    'SEARCHING_RESULT_PAGE.RED_FLAGS_TAB', // Red Flags
  ];
  // Info: (20231114 - Julian) Sorting Menu Options
  const sortingOptions = ['SORTING.RELEVANCY', ...sortOldAndNewOptions];
  // Info: (20231114 - Julian) Filter Tabs Shadow
  const shadowClassNameL =
    'before:absolute before:-inset-1 before:top-0 before:block xl:before:hidden before:w-5 before:bg-gradient-to-r before:from-black before:to-transparent';
  const shadowClassNameR =
    'after:absolute after:-inset-1 after:ml-auto after:top-0 after:block xl:after:hidden after:w-5 after:bg-gradient-to-l after:from-black after:to-transparent';

  // Info: (20231114 - Julian) Filter State
  const [searchText, setSearchText, searchTextRef] = useStateRef<string>(keyWord);
  const [sorting, setSorting] = useState(sortingOptions[0]);
  const [activeTab, setActiveTab] = useState(filterTabs[0]);
  const [period, setPeriod] = useState(defaultPeriod);
  // Info: (20231114 - Julian) Pagination State
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(dummySearchResult.length / ITEM_PER_PAGE));
  const [searchResult, setSearchResult] = useState<ISearchResult[]>([]);
  const [filteredResult, setFilteredResult] = useState<ISearchResult[]>([]);

  // Info: (20231115 - Julian) Pagination Index
  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    getSearchResult(searchTextRef.current).then(data => {
      setSearchResult(data);
    });
  }, [searchText]);

  useEffect(() => {
    const result = searchResult
      .filter(searchResult => {
        // Info: (20231115 - Julian) filter by Search bar
        const searchTerm = searchTextRef.current.toLowerCase();
        const id = searchResult.data.id.toLowerCase();
        const chainId = searchResult.data.chainId.toLowerCase();
        const type = searchResult.type.toLowerCase();
        return searchTerm === ''
          ? true
          : id.includes(searchTerm) || chainId.includes(searchTerm) || type.includes(searchTerm);
      })
      .filter(searchResult => {
        // Info: (20231115 - Julian) filter by Filter Tabs
        const type = searchResult.type;
        return activeTab === filterTabs[0] ? true : activeTab.includes(type);
      })
      .filter(searchResult => {
        // Info: (20231115 - Julian) filter by Date Picker
        const timestamp = searchResult.data.createdTimestamp;
        const startTimeStamp = period.startTimeStamp;
        const endTimeStamp = period.endTimeStamp;
        return startTimeStamp !== 0 && endTimeStamp !== 0
          ? timestamp >= startTimeStamp && timestamp <= endTimeStamp
          : true;
      })
      .sort((a, b) => {
        // Info: (20231115 - Julian) sort by Sorting Menu
        return sorting === sortingOptions[0]
          ? // ToDo: (20231115 - Julian) sort by Relevancy
            0
          : sorting === sortOldAndNewOptions[1]
          ? a.data.createdTimestamp - b.data.createdTimestamp
          : b.data.createdTimestamp - a.data.createdTimestamp;
      });

    setFilteredResult(result);
    setTotalPages(Math.ceil(result.length / ITEM_PER_PAGE));
    setActivePage(1);
  }, [searchText, sorting, activeTab, period, searchResult]);

  const resultList = filteredResult.slice(startIdx, endIdx).map((searchResult, index) => {
    return <SearchingResultItem key={index} searchResult={searchResult} />;
  });

  const displayedFilterTabs = filterTabs.map((tab, index) => {
    const tabClickHandler = () => setActiveTab(tab);
    const tabClassName = `whitespace-nowrap px-4 py-3 text-base border-b-3px ${
      activeTab === tab
        ? 'text-primaryBlue border-primaryBlue'
        : 'text-hoverWhite border-darkPurple4'
    } hover:text-primaryBlue cursor-pointer transition-all duration-150 ease-in-out`;

    return (
      <li key={index} className={tabClassName} onClick={tabClickHandler}>
        {t(tab)}
      </li>
    );
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col space-y-14 px-5 pb-20 pt-32 lg:px-40 lg:pt-48">
            {/* Info: (20231114 - Julian) Filter */}
            <div className="flex w-full flex-col items-center space-y-14 lg:space-y-10">
              {/* Info: (20231114 - Julian) Search Bar */}
              <div className="w-full lg:w-9/10">
                <SearchBar
                  searchBarPlaceholder={t('SEARCHING_RESULT_PAGE.SEARCH_PLACEHOLDER')}
                  setSearch={setSearchText}
                />
              </div>
              {/* Info: (20231114 - Julian) Filter Tabs */}
              <div className="relative w-full overflow-hidden">
                {/* Info: (20231114 - Julian) Shadow */}
                <div
                  className={`absolute flex h-full w-full ${shadowClassNameL} ${shadowClassNameR}`}
                ></div>
                <ul className="relative flex w-full items-center justify-between space-x-4 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden">
                  {displayedFilterTabs}
                </ul>
              </div>
              <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                {/* Info: (20231114 - Julian) Date Picker */}
                <div className="flex w-full items-center space-x-2 text-base lg:w-fit">
                  <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
                  <DatePicker period={period} setFilteredPeriod={setPeriod} />
                </div>
                {/* Info: (20231114 - Julian) Sorting Menu */}
                <div className="my-2 flex w-full items-center text-base lg:my-0 lg:w-fit lg:space-x-2">
                  <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
                  <SortingMenu
                    sortingOptions={sortingOptions}
                    sorting={sorting}
                    setSorting={setSorting}
                    bgColor="bg-darkPurple"
                  />
                </div>
              </div>
            </div>
            {/* Info: (20231114 - Julian) Search Result List */}
            <div className="flex-col items-center space-y-8">{resultList}</div>

            <div className="mx-auto w-full">
              <Pagination
                activePage={activePage}
                setActivePage={setActivePage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Info:(20231114 - Julian) Footer */}
      <Footer />
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default SearchingResultPage;
