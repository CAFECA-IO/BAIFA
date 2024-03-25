import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../../../../components/nav_bar/nav_bar';
import Footer from '../../../../components/footer/footer';
import CurrencyDetail from '../../../../components/currency_detail/currency_detail';
import {useEffect, useState} from 'react';
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
// import {AppContext} from '../../../../contexts/app_context';
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
  // const appCtx = useContext(AppContext);

  // Info: (今天 - Liz) Back Arrow Button
  const router = useRouter();
  const backClickHandler = () => router.push(`${BFAURL.CURRENCIES}`);

  // Info: (20240315 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [activePage, setActivePage] = useState<number>(1);

  // Info: (20240321 - Liz) Call API to get currency data (API-018)
  const {
    data: currencyDataRaw,
    isLoading: isCurrencyDataLoading,
    error: currencyDataError,
  } = useAPIResponse<ICurrencyDetailString>(`${APIURL.CURRENCIES}/${currencyId}`, {
    method: HttpMethod.GET,
  });

  // Info: (20240321 - Liz) 從 API 取得 currency data (如果沒有的話，就給預設值)
  const currencyData = currencyDataRaw ?? dummyCurrencyDetailString;

  // Info: (20240321 - Liz) 從 currencyData 取得 chainId, unit, currencyName
  const {unit, chainId, currencyName} = currencyData;
  const isCurrencyIdExist = currencyId === currencyData.currencyId;

  // Info: (20240321 - Liz) Call API to get transaction history data (API-030)
  const {
    data: transactionHistoryData,
    isLoading: isTransactionHistoryDataLoading,
    error: transactionHistoryError,
  } = useAPIResponse<ITransactionHistorySection>(
    `${APIURL.CURRENCIES}/${currencyId}/transactions`,
    // Info: (今天 - Liz) 預設值 ?page=1&sort=SORTING.NEWEST&search=&start_date=0&end_date=0
    {method: HttpMethod.GET},
    {
      page: activePage,
      sort: sorting,
      search: search,
      start_date: period.startTimeStamp,
      end_date: period.endTimeStamp,
    }
  );

  // Info: (20240321 - Liz) 從 API 取得 transaction history data (如果沒有的話，就給預設值)
  const {transactions, totalPages, transactionCount} = transactionHistoryData ?? {
    transactions: [],
    totalPages: 0,
    transactionCount: 0,
  };

  // Info: (20240307 - Liz) 當日期、搜尋、排序的條件改變時，將 activePage 設為 1。
  useEffect(() => {
    setActivePage(1);
  }, [search, period, sorting]);

  // Info: (20240315 - Liz) Get Currency Icon
  const currencyIcon = getCurrencyIcon(currencyId);

  // Info: (20240315 - Liz) head title
  const headTitle = isCurrencyIdExist ? `${currencyName} - BAIFA` : 'BAIFA';

  // Info: (20240321 - Liz) Header
  const displayedCurrencyName = isCurrencyIdExist ? currencyName : '--';
  const displayedHeader = (
    <div className="flex w-full items-center justify-start">
      {/* Info: (20231018 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {!isCurrencyDataLoading ? (
        <>
          {/* Info: (20231018 -Julian) Block Title */}
          <div className="flex flex-1 items-center justify-center space-x-2">
            <Image
              src={currencyIcon.src}
              alt={currencyIcon.alt}
              width={40}
              height={40} // Info: (20240206 - Julian) If the image fails to load, use the default currency icon
              onError={e => (e.currentTarget.src = DEFAULT_CURRENCY_ICON)}
            />
            <h1 className="text-2xl font-bold lg:text-32px">
              <span className="ml-2"> {displayedCurrencyName}</span>
            </h1>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center space-x-2">
          <Skeleton width={40} height={40} rounded />
          <Skeleton width={200} height={40} />
        </div>
      )}
    </div>
  );

  // Info: (20240321 - Liz) 畫面顯示元件

  const displayedCurrencyDetail =
    isCurrencyIdExist && !currencyDataError ? (
      <CurrencyDetail currencyData={currencyData} isLoading={isCurrencyDataLoading} />
    ) : (
      <DataNotFound />
    );

  const displayedTop100Holder =
    isCurrencyIdExist && !currencyDataError ? (
      <Top100HolderSection chainId={chainId} currencyId={currencyId} unit={unit} />
    ) : null;

  const displayedTransactionHistory =
    isCurrencyIdExist && !currencyDataError ? (
      !transactionHistoryError ? (
        <TransactionHistorySection
          transactions={transactions}
          period={period}
          setPeriod={setPeriod}
          sorting={sorting}
          setSorting={setSorting}
          setSearch={setSearch}
          activePage={activePage}
          setActivePage={setActivePage}
          isLoading={isTransactionHistoryDataLoading}
          totalPage={totalPages}
          transactionCount={transactionCount}
          // ToDo: (20240315 - Liz) add suggestions
          // suggestions={randomSuggestions}
        />
      ) : null
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
