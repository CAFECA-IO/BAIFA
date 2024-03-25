import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import Footer from '../../../../components/footer/footer';
import {
  DEFAULT_CHAIN_ICON,
  default30DayPeriod,
  sortOldAndNewOptions,
  defaultOption,
  redFlagTypeI18nObj,
} from '../../../../constants/config';
import {BsArrowLeftShort} from 'react-icons/bs';
import {TranslateFunction} from '../../../../interfaces/locale';
import {IMenuOptions, IRedFlagListForCurrency} from '../../../../interfaces/red_flag';
import RedFlagList from '../../../../components/red_flag_list/red_flag_list';
import {BFAURL} from '../../../../constants/url';
import {IDatePeriod} from '../../../../interfaces/date_period';
import useAPIResponse from '../../../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../../../constants/api_request';
import DataNotFound from '../../../../components/data_not_found/data_not_found';
import {getCurrencyIcon, convertStringToSortingType, getKeyByValue} from '../../../../lib/common';

interface IRedFlagOfCurrencyPageProps {
  currencyId: string;
}

const RedFlagOfCurrencyPage = ({currencyId}: IRedFlagOfCurrencyPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20240325 - Liz) Back Arrow Button
  const router = useRouter();
  const backClickHandler = () => router.push(`${BFAURL.CURRENCIES}/${currencyId}`);

  // Info: (20240319 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredType, setFilteredType] = useState<string>(defaultOption);
  const [activePage, setActivePage] = useState<number>(1);

  // Info: (20240325 - Liz) Call API to get menu options (API-034)
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

  // Info: (20240325 - Liz) Call API to get red flags data from a currency (API-019)
  const {
    data: redFlagData,
    isLoading: isRedFlagLoading,
    error: redFlagDataError,
  } = useAPIResponse<IRedFlagListForCurrency>(
    `${APIURL.CURRENCIES}/${currencyId}/red_flags`,
    {method: HttpMethod.GET},
    // Info: (20240325 - Liz) 預設值 page=1&sort=SORTING.NEWEST&search=&flag=&start_date=0&end_date=0
    {
      page: activePage,
      sort: convertStringToSortingType(sorting),
      search: search,
      flag: filteredTypeCode, // Info: (20240325 - Liz) filteredType 轉換成代碼格式再送出
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
    }
  );

  // Info: (20240325 - Liz) 從 API 取得總頁數
  const totalPages = redFlagData?.totalPages ?? 0;

  // Info: (20240307 - Liz) 當日期、搜尋、篩選、排序的條件改變時，將 activePage 設為 1。
  useEffect(() => {
    setActivePage(1);
  }, [search, filteredType, period, sorting]);

  // Info: (20240319 - Liz) head title and currency icon
  const currencyName = redFlagData?.chainName ?? '';
  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} ${t(
    'COMMON.OF'
  )} ${currencyName} - BAIFA`;
  const currencyIcon = getCurrencyIcon(currencyId);

  // Info: (20240325 - Liz) 畫面顯示元件
  const displayRedFlagList = !redFlagDataError ? (
    <RedFlagList
      redFlagData={redFlagData?.redFlagData ?? []}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      activePage={activePage}
      setActivePage={setActivePage}
      isLoading={isRedFlagLoading}
      totalPages={totalPages}
      typeOptions={redFlagTypeOptions}
      filteredType={filteredType}
      setFilteredType={setFilteredType}
    />
  ) : (
    <DataNotFound />
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231109 - Julian) Header */}
            <div className="flex w-full items-start justify-start">
              {/* Info: (20231109 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231109 -Julian) Red Flag Title */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl font-bold lg:text-48px">
                  <span className="text-lightRed">
                    {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}
                  </span>
                  {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE')}
                </h1>
                <div className="flex items-center space-x-2">
                  <Image
                    src={currencyIcon.src}
                    alt={currencyIcon.alt}
                    width={30}
                    height={30}
                    onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                  />
                  <p className="text-xl">{currencyName}</p>
                </div>
              </div>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="w-full">{displayRedFlagList}</div>

            {/* Info: (20231109 - Julian) Back button */}
            <div className="">
              <BoltButton
                onClick={backClickHandler}
                className="px-12 py-4 font-bold"
                color="blue"
                style="hollow"
              >
                {t('COMMON.BACK')}
              </BoltButton>
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

export default RedFlagOfCurrencyPage;

export const getStaticPaths: GetStaticPaths = async () => {
  // ToDo: (20231213 - Julian) Add dynamic paths
  const paths = [
    {
      params: {currencyId: 'isun'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps<IRedFlagOfCurrencyPageProps> = async ({
  params,
  locale,
}) => {
  if (!params || !params.currencyId || typeof params.currencyId !== 'string') {
    return {
      notFound: true,
    };
  }

  const currencyId = params.currencyId;

  return {
    props: {
      currencyId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
