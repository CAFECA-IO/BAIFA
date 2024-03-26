import Head from 'next/head';
import {useEffect, useState} from 'react';
import NavBar from '../../components/nav_bar/nav_bar';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import Pagination from '../../components/pagination/pagination';
import SearchBar from '../../components/search_bar/search_bar';
import BlacklistItem from '../../components/blacklist_item/blacklist_item';
import {IBlackListData} from '../../interfaces/blacklist';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {ITEM_PER_PAGE, sortOldAndNewOptions} from '../../constants/config';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../constants/api_request';
import Skeleton from '../../components/skeleton/skeleton';
import Footer from '../../components/footer/footer';
import {convertStringToSortingType} from '../../lib/common';

const BlackListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20240305 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const tagNameOptionDefault = 'SORTING.ALL';
  const [filteredTagName, setFilteredTagName] = useState<string>(tagNameOptionDefault);
  const [activePage, setActivePage] = useState<number>(1);

  // Info: (20240325 - Liz) Call API to get blacklist data (API-020)
  const {
    data: blacklist,
    isLoading,
    // error, // ToDo: (20240320 - Liz) 之後要處理 Error handling
  } = useAPIResponse<IBlackListData>(
    `${APIURL.BLACKLIST}`,
    {method: HttpMethod.GET},
    // Info: (20240326 - Liz) 預設值 ?sort=desc&search=&tag=&page=1
    {
      sort: convertStringToSortingType(sorting),
      search: search,
      tag: filteredTagName === tagNameOptionDefault ? `` : `${filteredTagName}`,
      page: activePage,
    }
  );

  // Info: (20240320 - Liz) 總頁數由 API 取得
  const totalPages = blacklist?.totalPages ?? 0;

  // Info: (20240306 - Liz) 下拉式選單選項由 API 取得
  const tagNames = blacklist?.tagNameOptions ?? [];
  const tagNameOptions = [tagNameOptionDefault, ...tagNames];

  // Info: (20240305 - Liz) 當搜尋或篩選的條件改變時，將 activePage 設為 1。雖然搜尋、篩選、排序都是重新打 API 拿新資料，但是搜尋、篩選的條件改變可能導致資料筆數改變，而 sorting 只是就該頁面的 10 筆資料做排序，所以不需要重設 activePage。
  useEffect(() => {
    setActivePage(1);
  }, [search, filteredTagName]);

  // Info: (20240306 - Liz) head title and breadcrumb
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

  const skeletonBlacklist = (
    <div className="flex h-680px w-full flex-col">
      {Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <div
          key={index}
          className="flex h-60px w-full items-center gap-4 border-b border-darkPurple4 px-4"
        >
          <Skeleton width={50} height={50} />
          <Skeleton width={30} height={30} rounded />
          <Skeleton width={100} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  );

  const displayBlacklist = isLoading
    ? skeletonBlacklist
    : blacklist?.blacklist?.map((blacklistItem, index) => {
        return <BlacklistItem key={index} blacklistAddress={blacklistItem} />;
      }) ?? [];

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
                <div className="flex w-full flex-col items-center gap-2 lg:h-72px lg:flex-row lg:justify-between">
                  {/* Info: (20231113 - Julian) Flagging Select Menu */}
                  <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
                    <SortingMenu
                      sortingOptions={tagNameOptions}
                      sorting={filteredTagName}
                      setSorting={setFilteredTagName}
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

              {/* Info: (20231113 - Julian) Black List */}
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

      <div className="mt-12">
        <Footer />
      </div>
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
