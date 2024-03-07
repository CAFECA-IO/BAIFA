import Head from 'next/head';
import {useEffect, useState, useContext} from 'react';
// import {AppContext} from '../../../contexts/app_context';
import {MarketContext} from '../../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NavBar from '../../../components/nav_bar/nav_bar';
import RedFlagList from '../../../components/red_flag_list/red_flag_list';
import Footer from '../../../components/footer/footer';
import {ILocale, TranslateFunction} from '../../../interfaces/locale';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import {BFAURL} from '../../../constants/url';
import {IRedFlagPage} from '../../../interfaces/red_flag';
import {sortOldAndNewOptions, default30DayPeriod} from '../../../constants/config';
import {IDatePeriod} from '../../../interfaces/date_period';

const RedFlagListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // const appCtx = useContext(AppContext);
  const {getAllRedFlags} = useContext(MarketContext);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // Info: (20240307 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const flagNameOptionDefault = 'SORTING.ALL';
  const [filteredFlagName, setFilteredFlagName] = useState<string>(flagNameOptionDefault);

  // Info: (20240307 - Liz) API 查詢參數
  const [apiQueryStr, setApiQueryStr] = useState(
    `page=1&sort=SORTING.NEWEST&search=&flag=&start_date=0&end_date=0`
  );

  // Info: (20240307 - Liz) UI
  const [redFlagData, setRedFlagData] = useState<IRedFlagPage>();
  const [activePage, setActivePage] = useState<number>(1);
  // Info: (20240307 - Liz) 從 API 取得總頁數
  const totalPages = redFlagData?.totalPages ?? 0;

  // Info: (20240307 - Liz) 下拉式選單選項由 API 取得
  const flagNames = redFlagData?.allRedFlagTypes ?? [];
  const flagNameOptions = [flagNameOptionDefault, ...flagNames];

  // Info: (20240307 - Liz) 當日期、搜尋、篩選、排序的條件改變時，將 activePage 設為 1。
  useEffect(() => {
    setActivePage(1);
  }, [search, filteredFlagName, period, sorting]);

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
  useEffect(() => {
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
  }, [apiQueryStr, getAllRedFlags]);

  // Info: (20240307 - Liz) filteredFlagName 轉換成代碼格式再送出
  const redFlagTypeCodesObj = redFlagData?.redFlagTypeCodeMeaningObj ?? {};

  const getKeyByValue = (
    object: {
      [key: string]: string;
    },
    value: string
  ) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  const filteredTagNameCode = getKeyByValue(redFlagTypeCodesObj, filteredFlagName) ?? '';

  // Info: (20240307 - Liz) 設定 API 查詢參數
  useEffect(() => {
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
  ]);

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

  // const displayedRedFlagList = !isLoading ? (
  //   <RedFlagList redFlagData={redFlagData} />
  // ) : (
  //   // ToDo: (20231215 -Julian) Loading animation
  //   <h1>Loading...</h1>
  // );

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
      // isLoading={isLoading} // ToDo: (20240307 - Liz) 再補上
      filteredType={filteredFlagName}
      setFilteredType={setFilteredFlagName}
      typeOptions={flagNameOptions}
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
