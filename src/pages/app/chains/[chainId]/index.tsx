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
import {IChainDetail} from '../../../../interfaces/chain';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../interfaces/locale';
import {BFAURL} from '../../../../constants/url';
import {chainList} from '../../../../constants/config';
import {getChainIcon} from '../../../../lib/common';

export interface IChainDetailPageProps {
  chainId: string;
}

const ChainDetailPage = ({chainId}: IChainDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getChainDetail} = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('blocks');
  const [chainData, setChainData] = useState<IChainDetail>({} as IChainDetail);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getChainData = async (chainId: string) => {
      try {
        const data = await getChainDetail(chainId);
        setChainData(data);
      } catch (error) {
        //console.log('getChainDetail error', error);
      }
    };

    getChainData(chainId);
  }, []);

  if (!chainData.chainId) return <h1>Data not found</h1>;

  const {chainId: chainIdFromData, chainName} = chainData;
  const headTitle = `${chainName} - BAIFA`;

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

  const displayedTitle = !isLoading ? (
    <div className="flex items-center justify-center space-x-4 py-5 text-2xl font-bold lg:text-48px">
      <Image
        className="block lg:hidden"
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={30}
        height={30}
      />
      <Image
        className="hidden lg:block"
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={60}
        height={60}
      />
      <h1>{chainName}</h1>
    </div>
  ) : (
    // ToDo: (20231213 - Julian) Loading Animation
    <></>
  );

  const blocksButton = (
    <div
      className={`flex items-center border-b-2 px-3 py-2 text-base ${
        activeTab === 'blocks'
          ? 'border-lightBlue text-primaryBlue'
          : 'border-darkPurple4 text-hoverWhite'
      } transition-all duration-300 ease-in-out`}
    >
      <button onClick={() => setActiveTab('blocks')}>{t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')}</button>
    </div>
  );

  const transactionsButton = (
    <div
      className={`flex items-center border-b-2 px-3 py-2 text-base ${
        activeTab === 'transactions'
          ? 'border-lightBlue text-primaryBlue'
          : 'border-darkPurple4 text-hoverWhite'
      } transition-all duration-300 ease-in-out`}
    >
      <button onClick={() => setActiveTab('transactions')}>
        {t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB')}
      </button>
    </div>
  );

  const tabContent = activeTab === 'blocks' ? <BlockTab /> : <TransactionTab />;

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
            {/* Info: (20230904 - Julian) Tabs */}
            <div className="flex items-center justify-center space-x-6 lg:py-7">
              {blocksButton}
              {transactionsButton}
            </div>
            {/* Info: (20230904 - Julian) Tab Content */}
            {tabContent}
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
