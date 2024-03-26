import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {GetServerSideProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import RedFlagDetail from '../../../components/red_flag_detail/red_flag_detail';
import BoltButton from '../../../components/bolt_button/bolt_button';
import Footer from '../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';
import {IRedFlagDetail} from '../../../interfaces/red_flag';
import {getChainIcon, convertStringToSortingType} from '../../../lib/common';
import {BFAURL} from '../../../constants/url';
import TransactionHistorySection from '../../../components/transaction_history_section/transaction_history_section';
import {ITransactionHistorySection} from '../../../interfaces/transaction';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../constants/config';
import {IDatePeriod} from '../../../interfaces/date_period';
import useAPIResponse from '../../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../../constants/api_request';
import DataNotFound from '../../../components/data_not_found/data_not_found';

interface IRedFlagDetailPageProps {
  redFlagId: string;
}

const RedFlagDetailPage = ({redFlagId}: IRedFlagDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const router = useRouter();
  const {page} = router.query;

  // Info: (20240320 - Liz) Back Arrow Button
  const backClickHandler = () => router.push(`${BFAURL.RED_FLAG}`);

  // Info: (20240315 - Liz) 搜尋條件
  const [search, setSearch] = useState<string>('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [activePage, setActivePage] = useState<number>(page ? +page : DEFAULT_PAGE);

  // Info: (20240321 - Liz) Call API to get red flag detail data (API-022)
  const {
    data: redFlagDataRaw,
    isLoading: isRedFlagDataLoading,
    error: redFlagDataError,
  } = useAPIResponse<IRedFlagDetail>(`${APIURL.RED_FLAGS}/${redFlagId}`, {
    method: HttpMethod.GET,
  });

  // Info: (20240321 - Liz)  從 API 取得 red flag detail data (如果沒有的話，就給預設值)

  const redFlagData = redFlagDataRaw ?? {
    id: '',
    chainId: '',
    createdTimestamp: 0,
    redFlagType: '',
    interactedAddresses: [],
    unit: '',
    totalAmount: '',
  };

  // Info: (20240325 - Liz) 從 redFlagData 取得資料
  const {id, chainId} = redFlagData;
  const isRedFlagIdExist = redFlagId === id;

  // Info: (20240321 - Liz) Call API to get transaction history data (API-035)
  const {
    data: transactionHistoryData,
    isLoading: isTransactionHistoryDataLoading,
    error: transactionHistoryError,
  } = useAPIResponse<ITransactionHistorySection>(
    `${APIURL.RED_FLAGS}/${redFlagId}/transactions`,
    // Info: (20240321 - Liz) 預設值 ?page=1&sort=desc&search=&start_date=&end_date=
    {method: HttpMethod.GET},
    {
      page: activePage,
      sort: convertStringToSortingType(sorting),
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
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

  // Info: (20240321 - Liz) Get Chain Icon
  const chainIcon = getChainIcon(chainId);

  // Info: (20240320 - Liz) head title
  const headTitle = `${t('RED_FLAG_ADDRESS_PAGE.MAIN_TITLE')} - BAIFA`;
  const displayedId = isRedFlagIdExist ? id : '--';

  // Info: (20240321 - Liz) 畫面顯示元件
  const displayedRedFlagDetail =
    !isRedFlagDataLoading && (!isRedFlagIdExist || redFlagDataError) ? (
      <DataNotFound />
    ) : !isRedFlagDataLoading && isRedFlagIdExist ? (
      <RedFlagDetail redFlagData={redFlagData} />
    ) : (
      <h1>Loading...</h1> // ToDo: (20240322 - Liz) Loading 方式要修改
    );

  const displayedTransactionHistory = isRedFlagIdExist ? (
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
        // ToDo: (20240320 - Liz) add suggestions
        // suggestions={randomSuggestions}
      />
    ) : null
  ) : null;

  const displayedButtons = isRedFlagIdExist ? (
    <>
      {/* Info: (20231110 - Julian) Download Report Button */}
      <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
        <BoltButton
          className="group flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
          color="purple"
          style="solid"
        >
          <Image
            src="/icons/download.svg"
            alt=""
            width={24}
            height={24}
            className="invert group-hover:invert-0"
          />
          <p>{t('RED_FLAG_ADDRESS_PAGE.DOWNLOAD_REPORT_BUTTON')}</p>
        </BoltButton>
      </Link>
      {/* Info: (20231110 - Julian) Open in Tracking Tool Button */}
      <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
        <BoltButton
          className="group flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
          color="purple"
          style="solid"
        >
          <Image
            src="/icons/tracking.svg"
            alt=""
            width={24}
            height={24}
            className="invert group-hover:invert-0"
          />
          <p>{t('RED_FLAG_ADDRESS_PAGE.OPEN_IN_TRACKING_TOOL_BUTTON')}</p>
        </BoltButton>
      </Link>
    </>
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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231110 - Julian) Header */}
            <div className="flex w-full items-center justify-start">
              {/* Info: (20231110 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231110 -Julian) Red Flag Address Title */}
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-2xl font-bold lg:flex-row lg:text-32px">
                <Image
                  src={chainIcon.src}
                  alt={chainIcon.alt}
                  width={40}
                  height={40}
                  onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                />
                <h1>
                  {t('RED_FLAG_ADDRESS_PAGE.RED_FLAG')}
                  <span className="text-primaryBlue"> {displayedId} </span>
                </h1>
              </div>
            </div>

            {/* Info: (20231110 - Julian) Buttons for Download Report and Open in Tracking Tool */}
            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
              {displayedButtons}
            </div>

            {/* Info: (20231110 - Julian)  Red Flag Detail */}
            <div className="w-full">{displayedRedFlagDetail}</div>

            {/* Info: (20231110 - Julian)  Transaction List */}
            <div className="w-full">{displayedTransactionHistory}</div>

            {/* Info: (20231110 - Julian) Back Button */}
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

export default RedFlagDetailPage;

// export const getStaticPaths: GetStaticPaths = async () => {
//   // ToDo: (20231213 - Julian) Add dynamic paths
//   const paths = [
//     {
//       params: {redFlagId: '1'},
//       //locale: 'en',
//     },
//   ];

//   return {paths, fallback: 'blocking'};
// };

// export const getStaticProps: GetStaticProps = async ({params, locale}) => {
//   if (!params || !params.redFlagId || typeof params.redFlagId !== 'string') {
//     return {
//       notFound: true,
//     };
//   }

//   const redFlagId = params.redFlagId;

//   return {
//     props: {redFlagId, ...(await serverSideTranslations(locale as string, ['common']))},
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const {redFlagId = ''} = query;
  return {
    props: {
      redFlagId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
