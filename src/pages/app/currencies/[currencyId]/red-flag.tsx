import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import Footer from '../../../../components/footer/footer';
import {AppContext} from '../../../../contexts/app_context';
import {MarketContext} from '../../../../contexts/market_context';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_RED_FLAG_COUNT_IN_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../constants/config';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getCurrencyIcon} from '../../../../lib/common';
import {TranslateFunction} from '../../../../interfaces/locale';
import {IRedFlagListForCurrency} from '../../../../interfaces/red_flag';
import RedFlagList from '../../../../components/red_flag_list/red_flag_list';
import Skeleton from '../../../../components/skeleton/skeleton';
import {IDatePeriod} from '../../../../interfaces/date_period';

interface IRedFlagOfCurrencyPageProps {
  currencyId: string;
}

// Info: (20240227 - Liz) Skeleton
const RedFlagListSkeleton = () => {
  const listSkeletons = Array.from({length: DEFAULT_RED_FLAG_COUNT_IN_PAGE}, (_, i) => (
    <div key={i} className="flex w-full flex-col">
      <div className="flex h-60px w-full items-center">
        {/* Info: (20231109 - Julian) Flagging Time square */}
        <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
          <Skeleton width={60} height={40} />
        </div>
        <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
          {/* Info: (20231109 - Julian) Address ID */}
          <Skeleton width={150} height={40} />
          {/* Info: (20231109 - Julian) Flag Type */}
          <div className="flex w-full justify-end">
            <Skeleton width={80} height={40} />
          </div>
        </div>
      </div>
    </div>
  ));
  return (
    <>
      {/* Info: (20231109 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-end space-y-10">
        {/* Info: (20231109 - Julian) Search Bar */}
        <div className="mx-auto my-5 flex w-full justify-center lg:w-7/10">
          <Skeleton width={800} height={40} />
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:h-72px lg:flex-row lg:justify-between">
          {/* Info: (20231109 - Julian) Type Select Menu */}
          <div className="relative flex w-full items-center space-y-2 text-base lg:w-200px">
            <Skeleton width={1023} height={40} />
          </div>
          {/* Info: (20231109 - Julian) Date Picker */}
          <div className="flex w-full items-center text-sm lg:w-220px lg:space-x-2">
            <Skeleton width={1023} height={40} />
          </div>
          {/* Info: (20231109 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center text-sm lg:w-220px lg:space-x-2">
            <Skeleton width={1023} height={40} />
          </div>
        </div>
      </div>

      {/* Info: (20231109 - Julian) Red Flag List */}
      <div className="mb-10 mt-16 flex w-full flex-col items-center space-y-0 lg:mt-10">
        {listSkeletons}
        {/* Info: Pagination (20240223 - Shirley) */}
      </div>
      <div className="flex w-full justify-center">
        <Skeleton width={200} height={40} />
      </div>
    </>
  );
};

const RedFlagOfCurrencyPage = ({currencyId}: IRedFlagOfCurrencyPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getRedFlagsOfCurrency} = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Info: (20240319 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const typeOptionDefault = 'SORTING.ALL';
  const [filteredType, setFilteredType] = useState<string>(typeOptionDefault);

  // Info: (20240319 - Liz) API 查詢參數
  const [apiQueryStr, setApiQueryStr] = useState(
    `page=1&sort=SORTING.NEWEST&search=&start_date=0&end_date=0`
  );

  // Info: (20240319 - Liz) UI
  const [redFlagListData, setRedFlagListData] = useState<IRedFlagListForCurrency>();
  const [activePage, setActivePage] = useState<number>(1);
  const totalPages = redFlagListData?.totalPages ?? 0;

  // Info: (20240319 - Liz) 下拉式選單選項由 API 取得
  const redFlagTypes = redFlagListData?.redFlagTypes ?? [];
  const redFlagTypeOptions = [typeOptionDefault, ...redFlagTypes];

  // Info: (20240307 - Liz) 當日期、搜尋、排序的條件改變時，將 activePage 設為 1。
  useEffect(() => {
    setActivePage(1);
  }, [search, period, sorting]);

  // Info: (20240319 - Liz) Call API to get red flag list data
  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const fetchRedFlagListData = async () => {
      try {
        const data = await getRedFlagsOfCurrency(currencyId, apiQueryStr);
        setRedFlagListData(data);
        setIsLoading(false);
      } catch (error) {
        //console.log('getRedFlagsOfCurrency error', error);
      }
    };

    fetchRedFlagListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240319 - Liz) filteredType 轉換成代碼格式再送出
  const redFlagTypeCodesObj = redFlagListData?.redFlagTypeCodeMeaningObj ?? {};

  const getKeyByValue = (
    object: {
      [key: string]: string;
    },
    value: string
  ) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  const filteredTypeCode = getKeyByValue(redFlagTypeCodesObj, filteredType) ?? '';

  // Info: (20240319 - Liz) 設定 API 查詢參數

  useEffect(() => {
    const pageQuery = `page=${activePage}`;
    const sortQuery = `&sort=${sorting}`;
    const searchQuery = `&search=${search}`;
    const startDateQuery = `&start_date=${period.startTimeStamp}`;
    const endDateQuery = `&end_date=${period.endTimeStamp}`;
    const flagQuery = `&flag=${filteredTypeCode}`;

    setApiQueryStr(
      `${pageQuery}${sortQuery}${searchQuery}${flagQuery}${startDateQuery}${endDateQuery}`
    );
  }, [activePage, filteredTypeCode, period.endTimeStamp, period.startTimeStamp, search, sorting]);

  // Info: (20240319 - Liz) head title & currency icon & back button
  const currencyName = redFlagListData?.redFlagData[0].chainName ?? '';
  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} ${t(
    'COMMON.OF'
  )} ${currencyName} - BAIFA`;
  const currencyIcon = getCurrencyIcon(currencyId);
  const router = useRouter();
  const backClickHandler = () => router.back();

  const displayRedFlagList = !isLoading ? (
    <RedFlagList
      redFlagData={redFlagListData?.redFlagData ?? []}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      activePage={activePage}
      setActivePage={setActivePage}
      isLoading={isLoading}
      totalPages={totalPages}
      typeOptions={redFlagTypeOptions}
      filteredType={filteredType}
      setFilteredType={setFilteredType}
    />
  ) : (
    // ToDo: (20231215 - Julian) Add loading animation
    <RedFlagListSkeleton />
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
