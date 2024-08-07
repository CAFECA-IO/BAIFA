import {useState, useEffect, useContext} from 'react';
import useStateRef from 'react-usestateref';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ParsedUrlQuery} from 'querystring';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {
  sortOldAndNewOptions,
  ITEM_PER_PAGE,
  default30DayPeriod,
  DEFAULT_PAGE,
} from '@/constants/config';
import {SearchType} from '@/constants/search_type';
import {TranslateFunction} from '@/interfaces/locale';
import {
  ISearchResultData,
  filterTabs,
  filterTabsToSearchType,
} from '@/interfaces/search_result';
import {convertStringToSortingType} from '@/lib/common';
import useAPIWorker from '@/lib/hooks/use_api_worker';
import {AppContext} from '@/contexts/app_context';
import NavBar from '@/components/nav_bar/nav_bar';
import Footer from '@/components/footer/footer';
import DatePicker from '@/components/date_picker/date_picker';
import SortingMenu from '@/components/sorting_menu/sorting_menu';
import SearchingResultItem from '@/components/searching_result_item/searching_result_item';
import Pagination from '@/components/pagination/pagination';
import GlobalSearch from '@/components/global_search/global_search';
import Skeleton from '@/components/skeleton/skeleton';

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
      <div className="rounded-lg bg-darkPurple p-6 shadow-xl transition-all duration-300 ease-in-out lg:p-8">
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

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();
  const {search} = router.query;
  const keyWord = search ? search.toString() : '';
  const {page} = router.query;

  const headTitle = `${t('SEARCHING_RESULT_PAGE.MAIN_TITLE')} - BAIFA`;

  // Info: (20231114 - Julian) Sorting Menu Options
  const sortingOptions = ['SORTING.RELEVANCY', ...sortOldAndNewOptions];
  // Info: (20231114 - Julian) Filter Tabs Shadow
  const shadowClassNameL =
    'before:absolute before:-inset-1 before:top-0 before:block xl:before:hidden before:w-5 before:bg-gradient-to-r before:from-black before:to-transparent';
  const shadowClassNameR =
    'after:absolute after:-inset-1 after:ml-auto after:top-0 after:block xl:after:hidden after:w-5 after:bg-gradient-to-l after:from-black after:to-transparent';

  // Info: (20231114 - Julian) Filter State
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText, searchTextRef] = useStateRef<string>(keyWord);
  const [sorting, setSorting] = useState(sortingOptions[0]);
  const [activeTab, setActiveTab] = useState(filterTabs[0]);
  const [period, setPeriod] = useState(default30DayPeriod);
  // Info: (20231114 - Julian) Pagination State
  const [activePage, setActivePage] = useState(page ? +page : DEFAULT_PAGE);

  const getInputValue = (value: string) => {
    setSearchText(value);
  };

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    //error: searchError,
  } = useAPIWorker<ISearchResultData>(
    `${APIURL.SEARCH_RESULT}`,
    {method: HttpMethod.GET},
    {
      search_input: searchTextRef.current,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
      sort: convertStringToSortingType(sorting),
      page: activePage,
      offset: ITEM_PER_PAGE,
      type: filterTabsToSearchType.get(activeTab) ?? SearchType.ALL,
    },
    true
  );

  useEffect(() => {
    if (searchQuery) {
      setSearchText(searchQuery);
    } else if (search) {
      setSearchText(search.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resultList = !isSearchLoading
    ? searchResults?.data.map((searchResults, index) => {
        return <SearchingResultItem key={index} searchResult={searchResults} />;
      })
    : Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <SearchingResultItemSkeleton key={index} />
      ));

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
                  <DatePicker
                    period={period}
                    setFilteredPeriod={setPeriod}
                    setActivePage={setActivePage}
                  />
                </div>
                {/* Info: (20231114 - Julian) Sorting Menu */}
                <div className="my-2 flex w-full items-center text-base lg:my-0 lg:w-fit lg:space-x-2">
                  <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
                  <SortingMenu
                    sortingOptions={sortingOptions}
                    sorting={sorting}
                    setSorting={setSorting}
                    bgColor="bg-darkPurple"
                    setActivePage={setActivePage}
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
                totalPages={searchResults?.totalPage ?? 0}
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
