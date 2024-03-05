import Head from 'next/head';
import {useState, useEffect, useContext, use} from 'react';
//import {AppContext} from '../../contexts/app_context';
import {MarketContext} from '../../contexts/market_context';
// import useStateRef from 'react-usestateref';
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
import {sortOldAndNewOptions} from '../../constants/config';

const BlackListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  //const appCtx = useContext(AppContext);
  const {getAllBlackList} = useContext(MarketContext);

  // Info: (20240305 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const tagNameOptionDefault = 'SORTING.ALL';
  const [filteredTagName, setFilteredTagName] = useState<string>(tagNameOptionDefault);

  // Info: (20240305 - Liz) API 查詢參數
  const [apiQueryStr, setApiQueryStr] = useState('');

  // Info: (20240305 - Liz) UI
  const [blacklist, setBlacklist] = useState<IBlackListData>();
  const [activePage, setActivePage] = useState<number>(1);
  // const totalPages = blacklist?.totalPages ?? 0;
  let totalPages = blacklist?.totalPages ?? 0; // ToDo: (20240305 - Liz) 之後拔掉 filter 改為由 API 處理，改成 const

  // Info: (20240305 - Liz) Call API to get blacklist data
  const fetchBlacklist = async () => {
    try {
      const data = await getAllBlackList(apiQueryStr);
      setBlacklist(data);
    } catch (error) {
      //console.log('getAllBlackList error', error);
    }
  };

  // Info: (20240305 - Liz) 當搜尋條件改變時，將 activePage 設為 1
  useEffect(() => {
    setActivePage(1);
  }, [search]);

  // Info: (20240305 - Liz) 當 API 查詢參數改變時，重新取得資料
  useEffect(() => {
    fetchBlacklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiQueryStr]);

  useEffect(() => {
    // Info: (20240305 - Liz) 設定 API 查詢參數
    const pageQuery = `page=${activePage}`;
    const sortQuery = `&sort=${sorting}`;
    const searchQuery = `&search=${search}`;
    // ToDo: (今天 - Liz) 新增用 tag name 篩選所有資料
    const tagQuery = `&tag=${filteredTagName}`;

    // Info: (20240305 - Liz) 當搜尋條件改變時，重新取得資料
    setApiQueryStr(`${pageQuery}${sortQuery}${searchQuery}${tagQuery}`);
  }, [activePage, filteredTagName, search, sorting]);

  // ToDo: (今天 - Liz) 下拉式選單選項改為由 API 取得
  const tagNames = blacklist?.blacklist?.map(blacklistItem => blacklistItem.tagName) ?? [];

  const tagNameOptions = [tagNameOptionDefault, ...tagNames];

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

  // ToDo: (今天 - Liz) 用 tag name 篩選資料要改成由 API 處理，這段會移除
  const result = blacklist?.blacklist.filter(blacklistItem => {
    // Info: (20240305 - Liz) filter by Tag Select Menu
    return filteredTagName === tagNameOptionDefault || filteredTagName === blacklistItem.tagName;
  });
  const resultLength = result?.length ?? 0;
  const resultPages = Math.ceil(resultLength / 10);

  if (filteredTagName !== tagNameOptionDefault) {
    totalPages = resultPages;
  }

  const displayBlacklist =
    // blacklist?.blacklist?.map((blacklistItem, index) => {
    //   return <BlacklistItem key={index} blacklistAddress={blacklistItem} />;
    // }) ?? [];
    result?.map((blacklistItem, index) => {
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
