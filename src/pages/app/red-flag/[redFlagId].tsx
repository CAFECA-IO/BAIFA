import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../../contexts/app_context';
import {MarketContext} from '../../../contexts/market_context';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import RedFlagDetail from '../../../components/red_flag_detail/red_flag_detail';
import BoltButton from '../../../components/bolt_button/bolt_button';
import Footer from '../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';
import {IRedFlagDetail} from '../../../interfaces/red_flag';
import {getChainIcon} from '../../../lib/common';
import {BFAURL} from '../../../constants/url';
import TransactionHistorySection from '../../../components/transaction_history_section/transaction_history_section';
import {ITransactionHistorySection} from '../../../interfaces/transaction';
import {
  DEFAULT_CHAIN_ICON,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../constants/config';
import {IDatePeriod} from '../../../interfaces/date_period';

interface IRedFlagDetailPageProps {
  redFlagId: string;
}

const RedFlagDetailPage = ({redFlagId}: IRedFlagDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getRedFlagDetail, getRedFlagTransactions} = useContext(MarketContext);

  // Info: (20240320 - Liz) Back Arrow Button
  const router = useRouter();
  const backClickHandler = () => router.push(`${BFAURL.RED_FLAG}`);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Info: (20240315 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  // Info: (20240320 - Liz) API 查詢參數
  const [apiQueryStr, setApiQueryStr] = useState(
    `page=1&sort=SORTING.NEWEST&search=&start_date=0&end_date=0`
  );

  // Info: (20240320 - Liz) UI
  const [redFlagData, setRedFlagData] = useState<IRedFlagDetail>({} as IRedFlagDetail);
  const [transactionsData, setTransactionsData] = useState<ITransactionHistorySection>();
  const [activePage, setActivePage] = useState<number>(1);

  // Info: (20240320 - Liz) 從 API 取得 Transaction History Data 的總頁數
  const transactionTotalPages = transactionsData?.totalPages ?? 0;

  // Info: (20240307 - Liz) 當日期、搜尋、排序的條件改變時，將 activePage 設為 1。
  useEffect(() => {
    setActivePage(1);
  }, [search, period, sorting]);

  useEffect(() => {
    // Info: (20240202 - Liz) Initialize app context
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // Info: (20240202 - Liz) Get red flag detail data
    const getRedFlagData = async (redFlagId: string) => {
      try {
        const data = await getRedFlagDetail(redFlagId);
        setRedFlagData(data);
        setIsLoading(false);
      } catch (error) {
        // console.log('getRedFlagDetail error', error);
      }
    };

    getRedFlagData(redFlagId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240320 - Liz) Call API to get transaction history data
  useEffect(() => {
    const getTransactionsData = async () => {
      try {
        const data = await getRedFlagTransactions(redFlagId, apiQueryStr);
        setTransactionsData(data);
        setIsLoading(false);
      } catch (error) {
        //console.log('getBlockDetail error', error);
      }
    };
    getTransactionsData();
    // Info: (20240320 - Liz) 當 API 查詢參數改變時，重新取得資料
  }, [apiQueryStr, getRedFlagTransactions, redFlagId]);

  // Info: (20240320 - Liz) 設定 API 查詢參數
  useEffect(() => {
    const pageQuery = `page=${activePage}`;
    const sortQuery = `&sort=${sorting}`;
    const searchQuery = `&search=${search}`;
    const startDateQuery = `&start_date=${period.startTimeStamp}`;
    const endDateQuery = `&end_date=${period.endTimeStamp}`;

    setApiQueryStr(`${pageQuery}${sortQuery}${searchQuery}${startDateQuery}${endDateQuery}`);
  }, [activePage, period.endTimeStamp, period.startTimeStamp, search, sorting]);

  // Info: (20240320 - Liz) head title
  const {id, chainId} = redFlagData;
  const headTitle = `${t('RED_FLAG_ADDRESS_PAGE.MAIN_TITLE')} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  // Info: (20240202 - Liz) Display transaction history data
  const displayedTransactionHistory = !isLoading ? (
    <TransactionHistorySection
      transactions={transactionsData?.transactions ?? []}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      activePage={activePage}
      setActivePage={setActivePage}
      isLoading={isLoading}
      totalPage={transactionTotalPages}
      transactionCount={transactionsData?.transactionCount ?? 0}
      // ToDo: (20240320 - Liz) add suggestions
      // suggestions={randomSuggestions}
    />
  ) : (
    <h1>Loading...</h1> // ToDo: (20240320 - Liz) Loading 方式要修改
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
                  <span className="text-primaryBlue"> {id}</span>
                </h1>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
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
              {/* Info: (20231110 - Julian) Open in Tracing Tool Button */}
              <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
                <BoltButton
                  className="group flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                  color="purple"
                  style="solid"
                >
                  <Image
                    src="/icons/tracing.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="invert group-hover:invert-0"
                  />
                  <p>{t('RED_FLAG_ADDRESS_PAGE.OPEN_IN_TRACING_TOOL_BUTTON')}</p>
                </BoltButton>
              </Link>
            </div>

            {/* Info: (20231110 - Julian)  Red Flag Detail */}
            <div className="w-full">
              <RedFlagDetail redFlagData={redFlagData} />
            </div>

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

export const getStaticPaths: GetStaticPaths = async () => {
  // ToDo: (20231213 - Julian) Add dynamic paths
  const paths = [
    {
      params: {redFlagId: '1'},
      //locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.redFlagId || typeof params.redFlagId !== 'string') {
    return {
      notFound: true,
    };
  }

  const redFlagId = params.redFlagId;

  return {
    props: {redFlagId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default RedFlagDetailPage;
