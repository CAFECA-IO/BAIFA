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
import {getChainIcon} from '../../../../lib/common';
import {APIURL} from '../../../../constants/api_request';
import {chainList} from '../../../../constants/config';

export interface IChainDetailPageProps {
  chainId: string;
  //chainData: IChainDetail;
}

const ChainDetailPage = ({chainId}: IChainDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getChainDetail} = useContext(MarketContext);

  const [chainData, setChainData] = useState<IChainDetail>({} as IChainDetail);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    getChainDetail(chainId).then(data => setChainData(data));
  }, []);

  console.log('blockData', chainData.blockData);

  const chainName = chainData.chainName;
  const chainIcon = getChainIcon(chainData.chainId).src;
  const headTitle = `${chainName} - BAIFA`;

  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('blocks');

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
      label:
        activeTab === 'blocks'
          ? t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')
          : t('CHAIN_DETAIL_PAGE.TRANSACTIONS_TAB'),
      path: BFAURL.CHAINS + '/' + chainData.chainId,
    },
  ];

  const mobileTitle = (
    <div className="flex items-center justify-center space-x-4 text-2xl font-bold lg:hidden">
      <Image src={chainIcon} alt={`${chainName}_icon`} width={30} height={30} />

      <h1>{chainName}</h1>
    </div>
  );

  const desktopTitle = (
    <div className="hidden items-center justify-center space-x-4 py-5 text-48px font-bold lg:flex">
      <Image src={chainIcon} alt={`${chainName}_icon`} width={60} height={60} />
      <h1>{chainName}</h1>
    </div>
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

  // const tabContent =
  //   activeTab === 'blocks' ? (
  //     <BlockTab blockList={chainData.blockData} />
  //   ) : (
  //     <TransactionTab transactionList={chainData.transactionData} />
  //   );

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
            {mobileTitle}
            {desktopTitle}
            {/* Info: (20230904 - Julian) Tabs */}
            <div className="flex items-center justify-center space-x-6 lg:py-7">
              {blocksButton}
              {transactionsButton}
            </div>
            {/* Info: (20230904 - Julian) Tab Content */}
            {`tabContent`}
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

  // fetch data from APIURL.CHAINS
  // const getChainData = async (chainId: string) => {
  //   let data: IChainDetail = {} as IChainDetail;
  //   try {
  //     const response = await fetch(`${APIURL.CHAINS}/${chainId}`, {
  //       method: 'GET',
  //     });
  //     data = await response.json();
  //   } catch (error) {
  //     //console.log('getChainData error', error);
  //   }
  //   return data;
  // };

  // const chainId = params.chainId;
  // const chainData = await getChainData(chainId);

  // if (!chainData) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: {
      chainId: params.chainId,
      //chainData: chainData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ChainDetailPage;
