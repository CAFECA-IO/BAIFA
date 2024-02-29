import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../../../../contexts/app_context';
import {MarketContext} from '../../../../../contexts/market_context';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../components/bolt_button/bolt_button';
import EvidenceDetail from '../../../../../components/evidence_detail/evidence_detail';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import TransactionHistorySection from '../../../../../components/transaction_history_section/transaction_history_section';
import Footer from '../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../interfaces/locale';
import {getChainIcon, truncateText} from '../../../../../lib/common';
import {BFAURL} from '../../../../../constants/url';
import {IEvidenceDetail} from '../../../../../interfaces/evidence';
import {ITransactionHistorySection} from '../../../../../interfaces/transaction';
import {
  DEFAULT_CHAIN_ICON,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../../constants/config';
import DataNotFound from '../../../../../components/data_not_found/data_not_found';
import {IDatePeriod} from '../../../../../interfaces/date_period';

interface IEvidenceDetailDetailPageProps {
  chainId: string;
  evidenceId: string;
}

const EvidenceDetailPage = ({chainId, evidenceId}: IEvidenceDetailDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getEvidenceDetail, getEvidenceTransactions} = useContext(MarketContext);

  const [evidenceData, setEvidenceData] = useState<IEvidenceDetail>({} as IEvidenceDetail);
  const [isNoData, setIsNoData] = useState(false);

  // Info: (20240227 - Julian) Transaction History States
  const [transactionHistoryData, setTransactionHistoryData] =
    useState<ITransactionHistorySection>();
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState(sortOldAndNewOptions[0]);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  const [apiQueryStr, setApiQueryStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const headTitle = `${t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} ${evidenceId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  const getEvidenceData = async () => {
    try {
      const evidenceData = await getEvidenceDetail(chainId, evidenceId);
      setEvidenceData(evidenceData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('getEvidenceData error: ', error);
    }
  };

  const getTransactionData = async () => {
    setIsLoading(true);
    try {
      const transactionHistoryData = await getEvidenceTransactions(
        chainId,
        evidenceId,
        apiQueryStr
      );
      setTransactionHistoryData(transactionHistoryData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('getTransactionData error: ', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    getEvidenceData();
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240219 - Julian) 如果沒有 3 秒內沒有資料，就顯示 No Data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!evidenceData.chainId) {
        setIsNoData(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [evidenceData]);

  useEffect(() => {
    const pageStr = `page=${activePage}`;
    const sortStr = `&sort=${sorting}`;
    const searchStr = search ? `&search=${search}` : '';
    const isPeriodValid = period.startTimeStamp && period.endTimeStamp;
    const timeStampStr = isPeriodValid
      ? `&start_date=${period.startTimeStamp}&end_date=${period.endTimeStamp}`
      : '';

    setApiQueryStr(`${pageStr}${sortStr}${searchStr}${timeStampStr}`);
  }, [activePage, search, sorting, period]);

  useEffect(() => {
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiQueryStr]);

  const isDownloadButton = isNoData ? null : (
    <Link href={BFAURL.COMING_SOON}>
      <BoltButton
        className="group flex items-center space-x-4 px-6 py-4"
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
        <p>{t('EVIDENCE_DETAIL_PAGE.DOWNLOAD_EVIDENCE_BUTTON')}</p>
      </BoltButton>
    </Link>
  );

  const isEvidenceDetail = isNoData ? (
    <DataNotFound />
  ) : (
    <EvidenceDetail evidenceData={evidenceData} />
  );

  const {transactions, totalPages, transactionCount} = transactionHistoryData ?? {
    transactions: [],
    totalPages: 0,
    transactionCount: 0,
  };

  const isPrivateNoteSection = isNoData ? null : <PrivateNoteSection />;
  const isTransactionHistorySection = isNoData ? null : (
    <TransactionHistorySection
      transactions={transactions}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      activePage={activePage}
      setActivePage={setActivePage}
      isLoading={isLoading}
      totalPage={totalPages}
      transactionCount={transactionCount}
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
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231107 - Julian) Header */}
            <div className="relative flex w-full flex-col items-center justify-start lg:flex-row">
              {/* Info: (20231107 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231107 -Julian) Evidence Title */}
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image
                  src={chainIcon.src}
                  alt={chainIcon.alt}
                  width={40}
                  height={40}
                  onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                />
                <h1 title={evidenceId} className="text-2xl font-bold lg:text-32px">
                  {t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue"> {truncateText(evidenceId, 10)}</span>
                </h1>
              </div>

              {/* Info: (20231107 - Julian) Download Evidence Button */}
              <div className="relative right-0 mt-6 lg:mt-0 xl:absolute">{isDownloadButton}</div>
            </div>

            {/* Info: (20231107 - Julian) Evidence Detail */}
            <div className="w-full pt-10">{isEvidenceDetail}</div>

            {/* Info: (20231107 - Julian) Private Note Section */}
            <div className="w-full">{isPrivateNoteSection}</div>

            {/* Info: (20231107 - Julian) Transaction History Section */}
            <div className="w-full">{isTransactionHistorySection}</div>

            {/* Info: (20231107 - Julian) Back Button */}
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
      params: {chainId: 'isun', evidenceId: '1'},
      locale: 'en',
    },
  ];

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }
  if (!params || !params.evidenceId || typeof params.evidenceId !== 'string') {
    return {
      notFound: true,
    };
  }

  const chainId = params.chainId;
  const evidenceId = params.evidenceId;

  return {
    props: {evidenceId, chainId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default EvidenceDetailPage;
