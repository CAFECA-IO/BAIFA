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
import {getChainIcon} from '../../../../../lib/common';
import {BFAURL} from '../../../../../constants/url';
import {IEvidence, dummyEvidenceData} from '../../../../../interfaces/evidence';
import {ITransaction} from '../../../../../interfaces/transaction';

interface IEvidenceDetailPageProps {
  evidenceId: string;
}

const EvidenceDetailPage = ({evidenceId}: IEvidenceDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getEvidenceDetail} = useContext(MarketContext);

  const headTitle = `${t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} ${evidenceId} - BAIFA`;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [evidenceData, setEvidenceData] = useState<IEvidence>({} as IEvidence);

  const {transactionHistoryData, chainId} = evidenceData;
  // Info: (20240102 - Julian) Transaction history
  const [transactionData, setTransactionData] = useState<ITransaction[]>([]);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getEvidenceData = async (chainId: string, evidenceId: string) => {
      const evidenceData = await getEvidenceDetail(chainId, evidenceId);
      setEvidenceData(evidenceData);
    };

    getEvidenceData(chainId, evidenceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);

    if (evidenceData) {
      setEvidenceData(evidenceData);
    }
    if (transactionHistoryData) {
      setTransactionData(transactionHistoryData);
    }

    timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [evidenceData]);

  const backClickHandler = () => router.back();

  const displayedEvidenceDetail = !isLoading ? (
    <EvidenceDetail evidenceData={evidenceData} />
  ) : (
    // ToDo: (20231214 - Julian) Add loading animation
    <h1>Loading...</h1>
  );

  const displayedTransactionHistory = !isLoading ? (
    <TransactionHistorySection transactions={transactionData} />
  ) : (
    // ToDo: (20231214 - Julian) Add loading animation
    <h1>Loading...</h1>
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
                  src={getChainIcon(chainId).src}
                  alt={getChainIcon(chainId).alt}
                  width={40}
                  height={40}
                />
                <h1 className="text-2xl font-bold lg:text-32px">
                  {t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue"> {evidenceId}</span>
                </h1>
              </div>

              {/* Info: (20231107 - Julian) Download Evidence Button */}
              <div className="relative right-0 mt-6 lg:mt-0 xl:absolute">
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
              </div>
            </div>

            {/* Info: (20231107 - Julian) Evidence Detail */}
            <div className="w-full pt-10">{displayedEvidenceDetail}</div>

            {/* Info: (20231107 - Julian) Private Note Section */}
            <div className="w-full">
              <PrivateNoteSection />
            </div>

            {/* Info: (20231107 - Julian) Transaction History Section */}
            <div className="w-full">{displayedTransactionHistory}</div>

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

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyEvidenceData
    .flatMap(evidence => {
      return locales?.map(locale => ({
        params: {chainId: evidence.chainId, evidenceId: `${evidence.id}`},
        locale,
      }));
    })
    .filter(
      (path): path is {params: {chainId: string; evidenceId: string}; locale: string} => !!path
    );

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

  const evidenceId = params.evidenceId;

  return {
    props: {evidenceId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default EvidenceDetailPage;
