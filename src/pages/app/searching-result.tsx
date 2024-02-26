import Head from 'next/head';
import {useState, useEffect, useContext, ChangeEvent, KeyboardEvent} from 'react';
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
import {sortOldAndNewOptions, ITEM_PER_PAGE, default30DayPeriod} from '../../constants/config';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {ISearchResult} from '../../interfaces/search_result';
import GlobalSearch from '../../components/global_search/global_search';
import {BFAURL} from '../../constants/url';
import {GetServerSideProps} from 'next';
import {ParsedUrlQuery} from 'querystring';
import Skeleton from '../../components/skeleton/skeleton';
import useStaleWhileRevalidateWithWorker from '../../lib/hooks/use_swr_with_worker';
import {APIURL} from '../../constants/api_request';

interface ISearchingResultPageProps {
  searchQuery: string;
}

interface IServerSideProps extends ParsedUrlQuery {
  search: string;
}

const SearchingResultItemSkeleton = () => {
  return (
    <div className="">
      {/* Info: (20240223 - Shirley) Link */}
      <div className="rounded-lg bg-darkPurple p-6 shadow-xl transition-all duration-300 ease-in-out hover:bg-purpleLinear lg:p-8">
        {/* Info: (20240223 - Shirley) Title */}
        <div className="flex w-full items-center lg:w-4/5">
          {/* Info: (20240223 - Shirley) ID */}
          <div className="flex-1">
            {' '}
            <Skeleton width={300} height={30} />
          </div>
          {/* Info: (20240223 - Shirley) SubTitle - For Desktop */}
          <div className="hidden lg:block">
            {' '}
            <Skeleton width={100} height={20} />
          </div>
        </div>

        {/* Info: (20240223 - Shirley) Content */}
        <div className="flex flex-col items-center lg:px-12">
          {/* Info: (20240223 - Shirley) Line 1 */}
          <div className="flex w-full flex-col items-start gap-2 border-b border-darkPurple4 py-5 lg:flex-row lg:items-center">
            <div className="flex w-200px items-center space-x-2">
              <div className="">
                <Skeleton width={200} height={30} />{' '}
              </div>
            </div>
            {/* Info: (20240223 - Shirley) Line 1 Content */}
            <Skeleton width={250} height={30} />{' '}
          </div>
          {/* Info: (20240223 - Shirley) Line 2 */}
          <div className="flex w-full flex-col items-start gap-2 border-b border-darkPurple4 py-5 lg:flex-row lg:items-center">
            <div className="flex w-200px items-center space-x-2">
              <div className="">
                <Skeleton width={200} height={30} />{' '}
              </div>
            </div>
            {/* Info: (20240223 - Shirley) Line 2 Content */}
            <Skeleton width={250} height={30} />{' '}
          </div>

          {/* Info: (20240223 - Shirley) SubTitle - For Mobile */}
          <div className="flex items-center py-5 lg:hidden">
            {' '}
            <Skeleton width={100} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchingResultPage = ({searchQuery}: ISearchingResultPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getSearchResult} = useContext(MarketContext);

  const [isLoading, setIsLoading, isLoadingRef] = useStateRef(true);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();
  const {search} = router.query;
  const keyWord = search ? search.toString() : '';

  const headTitle = `${t('SEARCHING_RESULT_PAGE.MAIN_TITLE')} - BAIFA`;
  const filterTabs = [
    'SEARCHING_RESULT_PAGE.ALL_TAB', // Info:(20231228 - Julian) All
    'SEARCHING_RESULT_PAGE.BLOCKS_TAB', // Info:(20231228 - Julian) Blocks
    'SEARCHING_RESULT_PAGE.ADDRESSES_TAB', // Info:(20231228 - Julian) Addresses
    'SEARCHING_RESULT_PAGE.CONTRACTS_TAB', // Info:(20231228 - Julian) Contracts
    'SEARCHING_RESULT_PAGE.EVIDENCES_TAB', // Info:(20231228 - Julian) Evidences
    'SEARCHING_RESULT_PAGE.TRANSACTIONS_TAB', // Info:(20231228 - Julian) Transactions
    'SEARCHING_RESULT_PAGE.BLACKLIST_TAB', // Info:(20231228 - Julian) Black List
    'SEARCHING_RESULT_PAGE.RED_FLAGS_TAB', // Info:(20231228 - Julian) Red Flags
  ];
  // Info: (20231114 - Julian) Sorting Menu Options
  const sortingOptions = ['SORTING.RELEVANCY', ...sortOldAndNewOptions];
  // Info: (20231114 - Julian) Filter Tabs Shadow
  const shadowClassNameL =
    'before:absolute before:-inset-1 before:top-0 before:block xl:before:hidden before:w-5 before:bg-gradient-to-r before:from-black before:to-transparent';
  const shadowClassNameR =
    'after:absolute after:-inset-1 after:ml-auto after:top-0 after:block xl:after:hidden after:w-5 after:bg-gradient-to-l after:from-black after:to-transparent';

  const [searchResult, setSearchResult] = useState<ISearchResult[]>([]);
  const [filteredResult, setFilteredResult] = useState<ISearchResult[]>([]);
  // Info: (20231114 - Julian) Filter State
  const [searchText, setSearchText, searchTextRef] = useStateRef<string>(keyWord);
  const [sorting, setSorting] = useState(sortingOptions[0]);
  const [activeTab, setActiveTab] = useState(filterTabs[0]);
  const [period, setPeriod] = useState(default30DayPeriod);
  // Info: (20231114 - Julian) Pagination State
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(filteredResult.length / ITEM_PER_PAGE));

  const getInputValue = (value: string) => {
    setSearchText(value);
  };

  // Info: (20231115 - Julian) Pagination Index
  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useStaleWhileRevalidateWithWorker<ISearchResult[]>(`${APIURL.SEARCH_RESULT}`, {
    search_input: searchTextRef.current,
  });
  // eslint-disable-next-line no-console
  console.log('data', searchResults, 'searchError', searchError);

  const getSearchResultData = async (searchText: string) => {
    try {
      const data = await getSearchResult(searchText);
      setSearchResult(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (searchQuery) {
      setSearchText(searchQuery);
    } else if (search) {
      setSearchText(search.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (searchTextRef.current.length === 0) return;
  //   (async () => {
  //     setIsLoading(true);
  //     await getSearchResultData(searchTextRef.current);
  //     setIsLoading(false);
  //   })();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchTextRef.current]);

  useEffect(() => {
    if (!searchResults) return;
    const result = searchResults
      /* TODO: don't filter data out by string (20240229 - Shirley)
      .filter(searchResults => {
        return true;
        // Info: (20231115 - Julian) filter by Search bar
        
        // const searchTerm = searchTextRef.current.toLowerCase();
        // const id = searchResults.data.id.toLowerCase();
        // const chainId = searchResults.data.chainId.toLowerCase();
        // const type = searchResults.type.toLowerCase();
        // return id.includes(searchTextRef.current);
        // return searchTerm === ''
        //   ? true
        //   : id.includes(searchTerm) || chainId.includes(searchTerm) || type.includes(searchTerm);
      })
      */
      .filter(searchResults => {
        // Info: (20231115 - Julian) filter by Filter Tabs
        const type = searchResults.type;
        return activeTab === filterTabs[0] ? true : activeTab.includes(type);
      })
      .filter(searchResults => {
        // Info: (20231115 - Julian) filter by Date Picker
        const timestamp = searchResults.data.createdTimestamp;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, sorting, activeTab, period, searchResults]);

  const resultList = !isSearchLoading
    ? // !isLoadingRef.current
      filteredResult.slice(startIdx, endIdx).map((searchResults, index) => {
        return <SearchingResultItem key={index} searchResult={searchResults} />;
      })
    : Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <SearchingResultItemSkeleton key={index} />
      ));
  // <Skeleton width={300} height={300} />

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
                <GlobalSearch
                  coverShowed={false}
                  getInputValue={getInputValue}
                  inputValueFromParent={searchTextRef.current}
                />
              </div>
              {/* Info: (20231114 - Julian) Filter Tabs */}
              <div className="relative w-full overflow-hidden">
                {/* Info: (20231114 - Julian) Shadow */}
                <div
                  className={`absolute flex h-full w-full ${shadowClassNameL} ${shadowClassNameR}`}
                ></div>
                <ul className="hideScrollbar relative flex w-full items-center justify-between space-x-4 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden">
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

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const {search = ''} = query as IServerSideProps; // Info: Casting query to ensure type safety. (20240202 - Shirley)

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
      search,
    },
  };
};

export default SearchingResultPage;
