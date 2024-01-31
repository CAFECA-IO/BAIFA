import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useContext, useState, useEffect, useRef} from 'react';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import NavBar from '../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../components/footer/footer';
import ContractDetail from '../../../../../components/contract_detail/contract_detail';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../interfaces/locale';
import {getChainIcon, truncateText} from '../../../../../lib/common';
import {BFAURL} from '../../../../../constants/url';
import {IContract} from '../../../../../interfaces/contract';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import TransactionHistorySection from '../../../../../components/transaction_history_section/transaction_history_section';
import Tooltip from '../../../../../components/tooltip/tooltip';
import {AppContext} from '../../../../../contexts/app_context';
import {MarketContext} from '../../../../../contexts/market_context';
import {ITransaction} from '../../../../../interfaces/transaction';
import {DEFAULT_TRUNCATE_LENGTH} from '../../../../../constants/config';

interface IContractDetailPageProps {
  contractId: string;
}

const ContractDetailPage = ({contractId}: IContractDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getContractDetail} = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contractData, setContractData] = useState<IContract>({} as IContract);

  const headTitle = `${t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')} ${contractId} - BAIFA`;
  const {transactionHistoryData, publicTag, chainId} = contractData;
  // Info: (20240102 - Julian) Transaction history
  const [transactionData, setTransactionData] = useState<ITransaction[]>([]);

  const backClickHandler = () => router.back();

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getContractData = async (chainId: string, contractId: string) => {
      const contractData = await getContractDetail(chainId, contractId);
      setContractData(contractData);
    };

    getContractData(chainId, contractId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (contractData) {
      setContractData(contractData);
    }
    if (transactionHistoryData) {
      setTransactionData(transactionHistoryData);
    }

    timerRef.current = setTimeout(() => setIsLoading(false), 500);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [contractData, transactionHistoryData]);

  // Info: (20240130 - Julian) 如果沒拿到 contractData ，就顯示 Data not found
  if (!contractData.id) return <h1>Data not found</h1>;

  const displayPublicTag = publicTag ? (
    publicTag.map((tag, index) => (
      <div
        key={index}
        className="whitespace-nowrap rounded border border-hoverWhite px-4 py-2 text-sm font-bold"
      >
        {t(tag)}
      </div>
    ))
  ) : (
    <></>
  );

  const displayedContractDetail = !isLoading ? (
    <ContractDetail contractData={contractData} />
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
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-28 lg:px-40 lg:pt-40">
            {/* Info: (20231106 - Julian) Header */}
            <div className="relative flex w-full flex-col items-center justify-start lg:flex-row lg:items-start">
              {/* Info: (20231106 - Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231106 - Julian) Contract Title */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src={getChainIcon(chainId).src}
                    alt={getChainIcon(chainId).alt}
                    width={40}
                    height={40}
                  />
                  <h1 className="text-2xl font-bold lg:text-32px" title={contractId}>
                    {t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')}
                    <span className="ml-2 text-primaryBlue">
                      {' '}
                      {truncateText(contractId, DEFAULT_TRUNCATE_LENGTH)}
                    </span>
                  </h1>
                </div>
                {/* Info: (20231109 - Julian) Public Tag */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-base font-bold text-lilac">
                    {t('PUBLIC_TAG.TITLE')}&nbsp;
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                    &nbsp;:
                  </div>
                  <div className="">{displayPublicTag}</div>
                </div>
              </div>
              {/* Info: (20231107 - Julian) Platform Link Button */}
              <div className="right-0 mt-6 w-2/3 lg:absolute lg:mt-0 lg:w-fit">
                <Link href={BFAURL.COMING_SOON}>
                  <BoltButton
                    className="group flex w-full items-center justify-center space-x-4 px-6 py-3"
                    color="purple"
                    style="solid"
                  >
                    <Image
                      src="/icons/link.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="invert group-hover:invert-0"
                    />
                    <p>{t('CONTRACT_DETAIL_PAGE.PLATFORM')}</p>
                  </BoltButton>
                </Link>
              </div>
            </div>

            {/* Info: (20231106 - Julian) Contract Detail */}
            <div className="my-10 w-full">{displayedContractDetail}</div>

            {/* Info: (20231106 - Julian) Private Note Section */}
            <div className="w-full">
              <PrivateNoteSection />
            </div>

            {/* Info: (20231103 - Julian) Transaction History */}
            <div className="my-10 w-full">{displayedTransactionHistory}</div>

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
      params: {chainId: 'isun', contractId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }
  if (!params || !params.contractId || typeof params.contractId !== 'string') {
    return {
      notFound: true,
    };
  }

  const contractId = params.contractId;

  return {
    props: {contractId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default ContractDetailPage;
