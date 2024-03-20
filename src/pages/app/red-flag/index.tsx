import Head from 'next/head';
import useAPIResponse from '../../../lib/hooks/use_api_response';
//import {useEffect, useState, useContext} from 'react';
import {useState} from 'react';
// import {AppContext} from '../../../contexts/app_context';
//import {MarketContext} from '../../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NavBar from '../../../components/nav_bar/nav_bar';
import RedFlagList from '../../../components/red_flag_list/red_flag_list';
import Footer from '../../../components/footer/footer';
import {ILocale, TranslateFunction} from '../../../interfaces/locale';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import {BFAURL} from '../../../constants/url';
import {IMenuOptions, IRedFlagPage} from '../../../interfaces/red_flag';
import {
  sortOldAndNewOptions,
  default30DayPeriod,
  defaultOption,
  redFlagTypeI18nObj,
} from '../../../constants/config';
import {IDatePeriod} from '../../../interfaces/date_period';
import {APIURL, HttpMethod} from '../../../constants/api_request';
import {convertStringToSortingType, getKeyByValue} from '../../../lib/common';

const RedFlagListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // const appCtx = useContext(AppContext);
  //const {getAllRedFlags} = useContext(MarketContext);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // Info: (20240307 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredFlagName, setFilteredFlagName] = useState<string>(defaultOption);
  // Info: (20240307 - Liz) UI
  //const [redFlagData, setRedFlagData] = useState<IRedFlagPage>();
  const [activePage, setActivePage] = useState<number>(1);

  // Info: (20240319 - Julian) Get menu options from API
  const {data: menuOptions} = useAPIResponse<IMenuOptions>(`${APIURL.RED_FLAGS}/menu_options`, {
    method: HttpMethod.GET,
  });

  // Info: (20240307 - Liz) filteredFlagName 轉換成代碼格式再送出
  const redFlagTypeCodesObj = menuOptions?.redFlagTypeMeaning ?? {};
  // Info: (20240307 - Liz) 下拉式選單選項由 API 取得
  const flagNames = menuOptions?.options ?? [];

  // Info: (20240320 - Julian) 將 DB 字串轉換成 i18n 字串
  const flagNameOptionWithI18n = flagNames.map(flagName => {
    return redFlagTypeI18nObj[flagName];
  });

  // Info: (20240320 - Julian) 選單選項(包含 all & 串上翻譯)
  const menuOption = [defaultOption, ...flagNameOptionWithI18n];

  // Info: (20240320 - Julian) 將 i18n 字串轉換成 DB 字串
  const i18nToStr = getKeyByValue(redFlagTypeI18nObj, filteredFlagName) ?? '';
  // Info: (20240320 - Julian) 將 DB 字串轉換成代碼
  const filteredTagNameCode = getKeyByValue(redFlagTypeCodesObj, i18nToStr) ?? '';

  // Info: (20240319 - Julian) Get red flag data from API
  const {data: redFlagData, isLoading: isRedFlagLoading} = useAPIResponse<IRedFlagPage>(
    `${APIURL.RED_FLAGS}`,
    {method: HttpMethod.GET},
    {
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
      sort: convertStringToSortingType(sorting),
      page: activePage,
      flagNames: filteredTagNameCode,
    }
  );

  // Info: (20240307 - Liz) 從 API 取得總頁數
  const totalPages = redFlagData?.totalPages ?? 0;

  // Info: (20240307 - Liz) API 查詢參數
  /*   const [apiQueryStr, setApiQueryStr] = useState(
    `page=1&sort=SORTING.NEWEST&search=&flag=&start_date=0&end_date=0`
  ); */

  // Info: (20240307 - Liz) 當日期、搜尋、篩選、排序的條件改變時，將 activePage 設為 1。
  /*   useEffect(() => {
    setActivePage(1);
  }, [search, filteredFlagName, period, sorting]); */

  /*
  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  // Info: (20240307 - Liz) Call API to get red flags data
  // ToDo: (20240307 - Liz) 之後看是否可以串成 Shirley 寫的 useAPIResponse
  /*   useEffect(() => {
    const getRedFlagData = async () => {
      try {
        const data = await getAllRedFlags(apiQueryStr);
        setRedFlagData(data);
      } catch (error) {
        //console.log('getAllRedFlags error', error);
      }
    };

    getRedFlagData();
    // Info: (20240307 - Liz) 當 API 查詢參數改變時，重新取得資料
  }, [apiQueryStr, getAllRedFlags]); */

  // Info: (20240307 - Liz) 設定 API 查詢參數
  /*   useEffect(() => {
    const pageQuery = `page=${activePage}`;
    const sortQuery = `&sort=${sorting}`;
    const searchQuery = `&search=${search}`;
    const startDateQuery = `&start_date=${period.startTimeStamp}`;
    const endDateQuery = `&end_date=${period.endTimeStamp}`;
    const flagQuery = `&flag=${filteredTagNameCode}`;

    setApiQueryStr(
      `${pageQuery}${sortQuery}${searchQuery}${flagQuery}${startDateQuery}${endDateQuery}`
    );
  }, [
    activePage,
    filteredTagNameCode,
    period.endTimeStamp,
    period.startTimeStamp,
    search,
    sorting,
  ]); */

  // Info: (20240307 - Liz) head title and breadcrumb
  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} - BAIFA`;
  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.RED_FLAG,
    },
  ];

  const displayedRedFlagList = (
    <RedFlagList
      redFlagData={redFlagData?.redFlagData ?? []}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      activePage={activePage}
      setActivePage={setActivePage}
      totalPages={totalPages}
      setSearch={setSearch}
      isLoading={isRedFlagLoading} // ToDo: (20240307 - Liz) 再補上
      filteredType={filteredFlagName}
      setFilteredType={setFilteredFlagName}
      typeOptions={menuOption}
    />
  );

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
            {/* Info: (20231109 -Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>

            {/* Info: (20231109 -Julian) Red Flag Title */}
            <div className="flex justify-center p-10">
              <h1 className="text-2xl font-bold lg:text-48px">
                <span className="text-lightRed">
                  {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}
                </span>
                {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE')}
              </h1>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="w-full">{displayedRedFlagList}</div>
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default RedFlagListPage;

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;
