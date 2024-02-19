import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useContext, useState, useEffect, use} from 'react';
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
import {IContractBrief} from '../../../../../interfaces/contract';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import TransactionHistorySection from '../../../../../components/transaction_history_section/transaction_history_section';
import Tooltip from '../../../../../components/tooltip/tooltip';
import {AppContext} from '../../../../../contexts/app_context';
import {MarketContext} from '../../../../../contexts/market_context';
import {IDisplayTransaction} from '../../../../../interfaces/transaction';
import {DEFAULT_CHAIN_ICON, DEFAULT_TRUNCATE_LENGTH} from '../../../../../constants/config';
import DataNotFound from '../../../../../components/data_not_found/data_not_found';

interface IContractDetailDetailPageProps {
  contractId: string;
}

const ContractDetailPage = ({contractId}: IContractDetailDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getContractDetail, getContractTransactions} = useContext(MarketContext);

  const [contractData, setContractData] = useState<IContractBrief>({} as IContractBrief);
  const [transactionHistoryData, setTransactionHistoryData] = useState<IDisplayTransaction[]>([]);
  const [isNoData, setIsNoData] = useState(false);

  const headTitle = `${t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')} ${contractId} - BAIFA`;
  const {publicTag, chainId} = contractData;

  const backClickHandler = () => router.back();

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getContractData = async (chainId: string, contractId: string) => {
      const contractData = await getContractDetail(chainId, contractId);
      setContractData(contractData);
    };

    const getTransactionHistoryData = async (chainId: string, contractId: string) => {
      const transactionHistoryData = await getContractTransactions(chainId, contractId);
      setTransactionHistoryData(transactionHistoryData);
    };

    getContractData(chainId, contractId);
    getTransactionHistoryData(chainId, contractId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240219 - Julian) 如果沒有 3 秒內沒有資料，就顯示 No Data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!contractData.chainId) {
        setIsNoData(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [contractData]);

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

  const isPlatformLink = isNoData ? null : (
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
  );

  const isContractData = isNoData ? (
    <DataNotFound />
  ) : (
    <ContractDetail contractData={contractData} />
  );

  const isPrivateNoteSection = isNoData ? null : <PrivateNoteSection />;

  const isTransactionHistoryData = isNoData ? null : (
    <TransactionHistorySection transactions={transactionHistoryData} />
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
                    onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                  />
                  <div
                    className="text-2xl font-bold lg:inline-flex lg:text-32px"
                    title={contractId}
                  >
                    <span>{t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')}</span>
                    <h1 className="text-primaryBlue lg:ml-2">
                      {truncateText(contractId, DEFAULT_TRUNCATE_LENGTH)}
                    </h1>
                  </div>
                </div>
                {/* Info: (20231109 - Julian) Public Tag */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-base font-bold text-lilac">
                    {t('PUBLIC_TAG.TITLE')}&nbsp;
                    <Tooltip>{t('PUBLIC_TAG.TOOLTIP_CONTENT')}</Tooltip>
                    &nbsp;:
                  </div>
                  <div className="">{displayPublicTag}</div>
                </div>
              </div>
              {/* Info: (20231107 - Julian) Platform Link Button */}
              <div className="right-0 mt-6 w-2/3 lg:absolute lg:mt-0 lg:w-fit">
                {isPlatformLink}
              </div>
            </div>

            {/* Info: (20231106 - Julian) Contract Detail */}
            <div className="my-10 w-full">{isContractData}</div>

            {/* Info: (20231106 - Julian) Private Note Section */}
            <div className="w-full">{isPrivateNoteSection}</div>

            {/* Info: (20231103 - Julian) Transaction History */}
            <div className="my-10 w-full">{isTransactionHistoryData}</div>

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
