import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../../../../components/nav_bar/nav_bar';
import Footer from '../../../../components/footer/footer';
import CurrencyDetail from '../../../../components/currency_detail/currency_detail';
import {useContext, useEffect, useState} from 'react';
import {GetStaticPaths, GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ICurrencyDetailString, dummyCurrencyDetailString} from '../../../../interfaces/currency';
import {BsArrowLeftShort} from 'react-icons/bs';
import {useRouter} from 'next/router';
import Top100HolderSection from '../../../../components/top_100_holder_section/top_100_holder_section';
import TransactionHistorySection from '../../../../components/transaction_history_section/transaction_history_section';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import {TranslateFunction} from '../../../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {AppContext} from '../../../../contexts/app_context';
//import {MarketContext} from '../../../../contexts/market_context';
import {getCurrencyIcon} from '../../../../lib/common';
import {
  DEFAULT_CURRENCY_ICON,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../constants/config';
import {ITransactionHistorySection} from '../../../../interfaces/transaction';
import {IDatePeriod} from '../../../../interfaces/date_period';
import {BFAURL} from '../../../../constants/url';
import useAPIResponse from '../../../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../../../constants/api_request';
import DataNotFound from '../../../../components/data_not_found/data_not_found';
import Skeleton from '../../../../components/skeleton/skeleton';

interface ICurrencyDetailPageProps {
  currencyId: string;
}

const CurrencyDetailPage = ({currencyId}: ICurrencyDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  //const {getCurrencyDetail, getCurrencyTransactions} = useContext(MarketContext);

  // Info: (20240315 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  // Info: (20240315 - Liz) UI
  /*   const [currencyData, setCurrencyData] = useState<ICurrencyDetailString>(
    {} as ICurrencyDetailString
  ); */
  //const [transactionsData, setTransactionsData] = useState<ITransactionHistorySection>();
  const [activePage, setActivePage] = useState<number>(1);

  const {
    data: currencyData,
    isLoading: isCurrencyLoading,
    error: currencyError,
  } = useAPIResponse<ICurrencyDetailString>(`${APIURL.CURRENCIES}/${currencyId}`, {
    method: HttpMethod.GET,
  });

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    //error: transactionsError,
  } = useAPIResponse<ITransactionHistorySection>(
    `${APIURL.CURRENCIES}/${currencyId}/transactions`,
    {method: HttpMethod.GET},
    {
      page: activePage,
      sort: sorting,
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
    }
  );

  //const [isLoading, setIsLoading] = useState<boolean>(true);

  // Info: (20240315 - Liz) API 查詢參數
  // const [apiQueryStr, setApiQueryStr] = useState(
  //   `page=1&sort=SORTING.NEWEST&search=&start_date=0&end_date=0`
  // );

  // Info: (20240315 - Liz) 從 API 取得 Transaction History Data 的總頁數
  const transactionTotalPages = transactionsData?.totalPages ?? 0;

  // Info: (20240307 - Liz) 當日期、搜尋、排序的條件改變時，將 activePage 設為 1。
  useEffect(() => {
    setActivePage(1);
  }, [search, period, sorting]);

  // Info: (20240315 - Liz) Get Currency Icon
  const currencyIcon = getCurrencyIcon(currencyId);

  // Info: (20240315 - Liz) Call API to get currency data
  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    // const getCurrencyData = async (currencyId: string) => {
    //   try {
    //     const data = await getCurrencyDetail(currencyId);
    //     setCurrencyData(data);
    //     setIsLoading(false);
    //   } catch (error) {
    //     //console.log('getBlockDetail error', error);
    //   }
    // };

    // getCurrencyData(currencyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240314 - Liz) Call API to get transaction history data
  // useEffect(() => {
  //   const getTransactionsData = async () => {
  //     try {
  //       const data = await getCurrencyTransactions(currencyId, apiQueryStr);
  //       setTransactionsData(data);
  //       //setIsLoading(false);
  //     } catch (error) {
  //       //console.log('getBlockDetail error', error);
  //     }
  //   };
  //   getTransactionsData();
  //   // Info: (20240315 - Liz) 當 API 查詢參數改變時，重新取得資料
  // }, [apiQueryStr, currencyId, getCurrencyTransactions]);

  // Info: (20240315 - Liz) 設定 API 查詢參數
  // useEffect(() => {
  //   const pageQuery = `page=${activePage}`;
  //   const sortQuery = `&sort=${sorting}`;
  //   const searchQuery = `&search=${search}`;
  //   const startDateQuery = `&start_date=${period.startTimeStamp}`;
  //   const endDateQuery = `&end_date=${period.endTimeStamp}`;

  //   setApiQueryStr(`${pageQuery}${sortQuery}${searchQuery}${startDateQuery}${endDateQuery}`);
  // }, [activePage, period.endTimeStamp, period.startTimeStamp, search, sorting]);

  // Info: (20240315 - Liz) head title and back button
  const {currencyName, unit, chainId} = currencyData ?? dummyCurrencyDetailString;
  const headTitle = `${currencyName} - BAIFA`;

  const backClickHandler = () => router.push(`${BFAURL.CURRENCIES}`);

  const isShowHeader = !currencyError ? (
    <div className="flex flex-1 items-center justify-center space-x-2">
      <Image
        src={currencyIcon.src}
        alt={currencyIcon.alt}
        width={40}
        height={40} // Info: (20240206 - Julian) If the image fails to load, use the default currency icon
        onError={e => (e.currentTarget.src = DEFAULT_CURRENCY_ICON)}
      />
      <h1 className="text-2xl font-bold lg:text-32px">
        <span className="ml-2"> {currencyName}</span>
      </h1>
    </div>
  ) : (
    <></>
  );

  const displayedHeader = (
    <div className="flex w-full items-center justify-start">
      {/* Info: (20231018 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {/* Info: (20231018 -Julian) Block Title */}
      {!isCurrencyLoading ? (
        isShowHeader
      ) : (
        <div className="flex flex-1 items-center justify-center space-x-2">
          <Skeleton width={40} height={40} rounded />
          <Skeleton width={200} height={40} />
        </div>
      )}
    </div>
  );

  const displayedCurrencyDetail = !currencyError ? (
    <CurrencyDetail
      currencyData={currencyData ?? dummyCurrencyDetailString}
      isLoading={isCurrencyLoading}
    />
  ) : (
    <DataNotFound />
  );

  const displayedTop100Holder = !currencyError ? (
    <Top100HolderSection chainId={chainId} currencyId={currencyId} unit={unit} />
  ) : null;

  const displayedTransactionHistory = !currencyError ? (
    <TransactionHistorySection
      transactions={transactionsData?.transactions ?? []}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      activePage={activePage}
      setActivePage={setActivePage}
      isLoading={isTransactionsLoading}
      totalPage={transactionTotalPages}
      transactionCount={transactionsData?.transactionCount ?? 0}
      // ToDo: (20240315 - Liz) add suggestions
      // suggestions={randomSuggestions}
    />
  ) : null;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231018 - Julian) Header */}
            {displayedHeader}

            {/* Info: (20231101 - Julian) Currency Detail */}
            <div className="my-10 w-full">{displayedCurrencyDetail}</div>

            {/* Info: (20231101 - Julian) Top 100 Holder */}
            <div className="my-10 w-full">{displayedTop100Holder}</div>

            {/* Info: (20231103 - Julian) Transaction History */}
            <div className="my-10 flex w-full">{displayedTransactionHistory}</div>

            {/* Info: (20231017 - Julian) Back Button */}
            <div className="mt-10">
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

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.currencyId || typeof params.currencyId !== 'string') {
    return {
      notFound: true,
    };
  }

  const currencyId = params.currencyId;

  return {
    props: {currencyId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default CurrencyDetailPage;
