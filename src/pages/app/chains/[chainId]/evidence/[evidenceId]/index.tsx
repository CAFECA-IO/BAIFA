import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useAPIResponse from '../../../../../../lib/hooks/use_api_response';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import EvidenceDetail from '../../../../../../components/evidence_detail/evidence_detail';
import PrivateNoteSection from '../../../../../../components/private_note_section/private_note_section';
import TransactionHistorySection from '../../../../../../components/transaction_history_section/transaction_history_section';
import Footer from '../../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {convertStringToSortingType, getChainIcon, truncateText} from '../../../../../../lib/common';
import {BFAURL} from '../../../../../../constants/url';
import {IEvidenceDetail, dummyEvidenceDetail} from '../../../../../../interfaces/evidence';
import {ITransactionHistorySection} from '../../../../../../interfaces/transaction';
import {
  DEFAULT_CHAIN_ICON,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../../../constants/config';
import DataNotFound from '../../../../../../components/data_not_found/data_not_found';
import {IDatePeriod} from '../../../../../../interfaces/date_period';
import {APIURL, HttpMethod} from '../../../../../../constants/api_request';

interface IEvidenceDetailDetailPageProps {
  chainId: string;
  evidenceId: string;
}

const EvidenceDetailPage = ({chainId, evidenceId}: IEvidenceDetailDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const backClickHandler = () => router.back();
  const appCtx = useContext(AppContext);

  // Info: (20240227 - Julian) Transaction History query
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState(sortOldAndNewOptions[0]);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Info: (20240314 - Julian) Evidence Detail API
  const {
    data: evidenceData,
    isLoading: isEvidenceLoading,
    error: evidenceError,
  } = useAPIResponse<IEvidenceDetail>(`${APIURL.CHAINS}/${chainId}/evidence/${evidenceId}`, {
    method: HttpMethod.GET,
  });

  // Info: (20240314 - Julian) Transaction History API
  const {
    data: transactionHistoryData,
    isLoading: isTransactionHistoryLoading,
    error: transactionHistoryError,
  } = useAPIResponse<ITransactionHistorySection>(
    `${APIURL.CHAINS}/${chainId}/contracts/${evidenceId}/transactions`,
    {method: HttpMethod.GET},
    {
      page: activePage,
      sort: convertStringToSortingType(sorting),
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
    }
  );

  const headTitle = `${t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} ${evidenceId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDownloadButton = !evidenceError ? (
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
  ) : null;

  const isEvidenceDetail = !evidenceError ? (
    <EvidenceDetail
      evidenceData={evidenceData ?? dummyEvidenceDetail}
      isLoading={isEvidenceLoading}
    />
  ) : (
    <DataNotFound />
  );

  const {transactions, totalPages, transactionCount} = transactionHistoryData ?? {
    transactions: [],
    totalPages: 0,
    transactionCount: 0,
  };

  const isPrivateNoteSection = !evidenceError ? <PrivateNoteSection /> : null;

  const isTransactionHistorySection = !transactionHistoryError ? (
    <TransactionHistorySection
      transactions={transactions}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      setSearch={setSearch}
      activePage={activePage}
      setActivePage={setActivePage}
      isLoading={isTransactionHistoryLoading}
      totalPage={totalPages}
      transactionCount={transactionCount}
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
