import Head from 'next/head';
import Image from 'next/image';
import {AppContext} from '../../../../contexts/app_context';
import {MarketContext} from '../../../../contexts/market_context';
import {useState, useEffect, useContext} from 'react';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../components/nav_bar/nav_bar';
import Footer from '../../../../components/footer/footer';
import Breadcrumb from '../../../../components/breadcrumb/breadcrumb';
import BlockTab from '../../../../components/block_tab/block_tab';
import TransactionTab from '../../../../components/transaction_tab/transaction_tab';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {IChain} from '../../../../interfaces/chain';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../interfaces/locale';
import {BFAURL} from '../../../../constants/url';
import {DEFAULT_CHAIN_ICON, chainList} from '../../../../constants/config';
import {getChainIcon} from '../../../../lib/common';
import Skeleton from '../../../../components/skeleton/skeleton';
import DataNotFound from '../../../../components/data_not_found/data_not_found';

export interface IChainDetailPageProps {
  chainId: string;
}

enum ChainDetailTab {
  BLOCKS = 'blocks',
  TRANSACTIONS = 'transactions',
}

const ChainDetailPage = ({chainId}: IChainDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getChainDetail} = useContext(MarketContext);

  const [activeTab, setActiveTab] = useState<ChainDetailTab>(ChainDetailTab.BLOCKS);
  const [chainData, setChainData] = useState<IChain>({} as IChain);
  const [isLoading, setIsLoading] = useState(true);
  // ToDo: (20240313 - Julian) data not found
  const [isNoData, setIsNoData] = useState(false);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getChainData = async (chainId: string) => {
      // Info: (20240220 - Julian) 顯示 Loading 畫面
      setIsLoading(true);
      try {
        const data = await getChainDetail(chainId);
        setChainData(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('getChainDetail error', error);
      }
      // Info: (20240220 - Julian) 拿到資料就將 isLoading 設為 false
      setIsLoading(false);
    };

    getChainData(chainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240217 - Julian) 如果 isNoData 為 true，顯示預設值
  const {chainId: chainIdFromData, chainName} = isNoData
    ? {chainId: '--', chainName: '--'}
    : chainData;
  const headTitle = isLoading ? 'Loading...' : `${chainName} - BAIFA`;
  const chainIcon = getChainIcon(chainIdFromData);

  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('CHAINS_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.CHAINS,
    },
    {
      label: chainName,
      path: BFAURL.CHAINS + '/' + chainIdFromData,
    },
  ];

  const displayedTitle = isLoading ? (
    // Info: (20240206 - Julian) Loading animation
    <>
      <div className="hidden items-center justify-center space-x-4 p-5 lg:flex">
        <Skeleton width={60} height={60} rounded />
        <Skeleton width={250} height={60} />
      </div>
      <div className="flex items-center justify-center space-x-4 p-5 lg:hidden">
        <Skeleton width={30} height={30} rounded />
        <Skeleton width={100} height={30} />
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center space-x-4 py-5 text-2xl font-bold lg:text-48px">
      <Image
        className="block lg:hidden"
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={30}
        height={30}
        // Info: (20230206 - Julian) If the image fails to load, it will display the default icon.
        onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        priority
      />
      <Image
        className="hidden lg:block"
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={60}
        height={60}
        onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        priority
      />
      <h1>{chainName}</h1>
    </div>
  );

  const blocksButton = (
    <div
      className={`flex items-center border-b-2 px-3 py-2 text-base ${
        activeTab === ChainDetailTab.BLOCKS
          ? 'border-lightBlue text-primaryBlue'
          : 'border-darkPurple4 text-hoverWhite'
      } transition-all duration-300 ease-in-out`}
    >
      <button onClick={() => setActiveTab(ChainDetailTab.BLOCKS)}>
        {t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')}
      </button>
    </div>
  );

  const transactionsButton = (
    <div
      className={`flex items-center border-b-2 px-3 py-2 text-base ${
        activeTab === ChainDetailTab.TRANSACTIONS
          ? 'border-lightBlue text-primaryBlue'
          : 'border-darkPurple4 text-hoverWhite'
      } transition-all duration-300 ease-in-out`}
    >
      <button onClick={() => setActiveTab(ChainDetailTab.TRANSACTIONS)}>
        {t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB')}
      </button>
    </div>
  );

  const tabContent =
    activeTab === ChainDetailTab.BLOCKS ? (
      <BlockTab chainDetailLoading={isLoading} />
    ) : (
      <TransactionTab chainDetailLoading={isLoading} />
    );

  const displayBody = isNoData ? (
    <DataNotFound />
  ) : (
    <>
      {/* Info: (20230904 - Julian) Tabs */}
      <div className="flex items-center justify-center space-x-6 lg:py-7">
        {blocksButton}
        {transactionsButton}
      </div>
      {/* Info: (20230904 - Julian) Tab Content */}
      {tabContent}
    </>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col space-y-14 px-5 pt-28 lg:space-y-0 lg:px-20">
            {/* Info: (20230904 - Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>
            {/* Info: (20230904 - Julian) Page Title */}
            {displayedTitle}
            {displayBody}
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
  const paths = chainList
    .flatMap(chain => {
      return locales?.map(locale => ({params: {chainId: chain}, locale}));
    })
    .filter((path): path is {params: {chainId: string}; locale: string} => !!path);

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

  return {
    props: {
      chainId: params.chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ChainDetailPage;
