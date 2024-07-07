import {useState} from 'react';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {
  sortOldAndNewOptions,
  default30DayPeriod,
  defaultOption,
  redFlagTypeI18nObj,
  ITEM_PER_PAGE,
  DEFAULT_PAGE,
} from '@/constants/config';
import {BFAURL} from '@/constants/url';
import {IDatePeriod} from '@/interfaces/date_period';
import {TranslateFunction} from '@/interfaces/locale';
import {IMenuOptions, IRedFlagPage} from '@/interfaces/red_flag';
import {convertStringToSortingType, getKeyByValue} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';
import NavBar from '@/components/nav_bar/nav_bar';
import RedFlagList from '@/components/red_flag_list/red_flag_list';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';

const RedFlagListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const router = useRouter();
  const {page} = router.query;

  // Info: (20240307 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredType, setFilteredType] = useState<string>(defaultOption);
  const [activePage, setActivePage] = useState<number>(page ? +page : DEFAULT_PAGE);

  // Info: (20240319 - Julian) Call API to get menu options (API-034)
  const {data: menuOptions} = useAPIResponse<IMenuOptions>(`${APIURL.RED_FLAGS}/menu_options`, {
    method: HttpMethod.GET,
  });

  // Info: (20240307 - Liz) 取得代碼意義對照表
  const redFlagTypeCodeMeaningObj = menuOptions?.redFlagTypeCodeMeaningObj ?? {};

  // Info: (20240307 - Liz) 下拉式選單選項由 API 取得(選項是一般字串，格式像是: Large Deposit，而非 DB 原代碼: 0-9)
  const redFlagTypes = menuOptions?.options ?? [];

  // Info: (20240320 - Julian) 將下拉式選單選項的一般字串轉換成 i18n 字串
  const redFlagTypeOptionWithI18n = redFlagTypes.map(redFlagType => {
    return redFlagTypeI18nObj[redFlagType];
  });

  // Info: (20240320 - Julian) 選單選項(包含 all & 串上翻譯)
  const redFlagTypeOptions = [defaultOption, ...redFlagTypeOptionWithI18n];

  // Info: (20240320 - Julian) 將已被選擇選項轉成 DB 代碼 : 先將 i18n 字串轉換成一般字串，再將一般字串轉換成 DB 代碼
  const i18nToStr = getKeyByValue(redFlagTypeI18nObj, filteredType) ?? '';
  const filteredTypeCode = getKeyByValue(redFlagTypeCodeMeaningObj, i18nToStr) ?? '';

  // Info: (20240325 - Liz) Call API to get red flag data (API-021)
  const {data: redFlagData, isLoading: isRedFlagLoading} = useAPIResponse<IRedFlagPage>(
    `${APIURL.RED_FLAGS}`,
    {method: HttpMethod.GET},
    // Info: (20240325 - Liz) 預設值 page=1&offset=10&sort=desc&search=&flag=0&start_date=&end_date=
    {
      page: activePage,
      offset: ITEM_PER_PAGE,
      sort: convertStringToSortingType(sorting),
      search: search,
      flag: filteredTypeCode, // Info: (20240307 - Liz) filteredType 轉換成代碼格式再送出
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
    }
  );

  // Info: (20240307 - Liz) 從 API 取得總頁數
  const totalPages = redFlagData?.totalPages ?? 0;

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

  // Info: (20240325 - Liz) 畫面顯示元件
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
      isLoading={isRedFlagLoading}
      filteredType={filteredType}
      setFilteredType={setFilteredType}
      typeOptions={redFlagTypeOptions}
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

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
