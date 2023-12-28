import Head from 'next/head';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../contexts/app_context';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';
import NavBar from '../../components/nav_bar/nav_bar';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import Pagination from '../../components/pagination/pagination';
import SearchBar from '../../components/search_bar/search_bar';
import BlacklistItem from '../../components/blacklist_item/blacklist_item';
import {IBlacklist} from '../../interfaces/blacklist';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {sortOldAndNewOptions} from '../../constants/config';

const BlackListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {blacklist} = useContext(MarketContext);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  // Info: (20231113 - Julian) Flagging Options
  const flaggingType = blacklist
    .flatMap(address => address.flaggingRecords)
    .map(flagging => flagging);
  const flaggingOptions = ['SORTING.ALL'];
  flaggingType.forEach(type => {
    if (!flaggingOptions.includes(type)) {
      flaggingOptions.push(type);
    }
  });

  // Info: (20231113 - Julian) Page State
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // Info: (20231113 - Julian) Filter State
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredFlagging, setFilteredFlagging] = useState<string>(flaggingOptions[0]);
  // Info: (20231113 - Julian) Blacklist State
  const [filteredBlacklist, setFilteredBlacklist] = useState<IBlacklist[]>(blacklist);

  const headTitle = `${t('BLACKLIST_PAGE.BREADCRUMB_TITLE')} - BAIFA`;
  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('BLACKLIST_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.BLACKLIST,
    },
  ];

  useEffect(() => {
    const result = blacklist
      .filter(address => {
        // Info: (20231113 - Julian) filter by Search bar
        const searchTerm = searchRef.current.toLowerCase();
        const id = address.id.toLowerCase();
        return searchTerm !== '' ? id.includes(searchTerm) : true;
      })
      .filter(address => {
        // Info: (20231113 - Julian) filter by Flagging Select Menu
        const flagging = address.flaggingRecords;
        const type = filteredFlagging;
        return type === 'SORTING.ALL' ? true : flagging.some(flagging => flagging === type);
      })
      .sort(
        // Info: (20231113 - Julian) sort by Sorting Menu
        (a, b) => {
          const aTimestamp = a.latestActiveTime;
          const bTimestamp = b.latestActiveTime;
          return sorting === sortOldAndNewOptions[0]
            ? bTimestamp - aTimestamp
            : aTimestamp - bTimestamp;
        }
      );

    setFilteredBlacklist(result);
    setTotalPages(Math.ceil(result.length / 10));
    setActivePage(1);
  }, [search, filteredFlagging, sorting]);

  const displayBlacklist = filteredBlacklist.slice(0, 10).map((address, index) => {
    return <BlacklistItem key={index} blacklistAddress={address} />;
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden">
          <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
            {/* Info: (20231113 -Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>

            {/* Info: (20231113 -Julian) Black List Title */}
            <div className="flex justify-center p-10">
              <h1 className="text-2xl font-bold lg:text-48px">
                <span className="text-lightRed">{t('BLACKLIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
                {t('BLACKLIST_PAGE.MAIN_TITLE')}
              </h1>
            </div>

            {/* Info: (20231113 - Julian) Black List */}
            <div className="w-full">
              {/* Info: (20231113 - Julian) Search Filter */}
              <div className="flex w-full flex-col items-end space-y-10">
                {/* Info: (20231113 - Julian) Search Bar */}
                <div className="mx-auto my-5 w-full lg:w-7/10">
                  <SearchBar
                    searchBarPlaceholder={t('BLACKLIST_PAGE.SEARCH_PLACEHOLDER')}
                    setSearch={setSearch}
                  />
                </div>
                <div className="flex h-72px w-full flex-col items-center gap-2 lg:flex-row lg:justify-between">
                  {/* Info: (20231113 - Julian) Flagging Select Menu */}
                  <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
                    <SortingMenu
                      sortingOptions={flaggingOptions}
                      sorting={filteredFlagging}
                      setSorting={setFilteredFlagging}
                      bgColor="bg-darkPurple"
                    />
                  </div>
                  {/* Info: (20231113 - Julian) Sorting Menu */}
                  <div className="relative flex w-full items-center text-sm lg:w-fit lg:space-x-2">
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

              {/* Info: (20231113 - Julian) Blcak List */}
              <div className="mt-10 flex w-full flex-col items-center space-y-10">
                <div className="flex w-full flex-col space-y-2 lg:space-y-0">
                  {displayBlacklist}
                </div>
                <Pagination
                  activePage={activePage}
                  setActivePage={setActivePage}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default BlackListPage;
