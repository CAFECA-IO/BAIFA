import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyChains} from '../../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';
import {BFAURL} from '../../../constants/url';

export interface IChainDetailPageProps {
  chainId: string;
  chainData: {
    chainId: string;
    chainName: string;
    icon: string;
    blocks: number;
    transactions: number;
  };
}

const ChainDetailPage = ({chainData}: IChainDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const chainName = chainData.chainName;
  const chainIcon = chainData.icon;

  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('blocks');

  const crumbs = [
    {
      label: t('BREADCRUMB.HOME'),
      path: BFAURL.APP,
    },
    {
      label: t('BREADCRUMB.CHAINS'),
      path: BFAURL.CHAINS,
    },
    {
      label: activeTab === 'blocks' ? t('BREADCRUMB.BLOCKS') : t('BREADCRUMB.TRANSACTIONS'),
      path: BFAURL.CHAINS + '/' + chainData.chainId,
    },
  ];

  const blockTabCilckHandler = () => setActiveTab('blocks');
  const transactionTabCilckHandler = () => setActiveTab('transactions');

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>BAIFA - {chainName}</title>
      </Head>

      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col px-4 pt-32 lg:px-20">
            {/* Info: (20230904 - Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>
            <div className="flex flex-col items-center">
              {/* Info: (20230904 - Julian) Page Title */}
              <div className="flex items-center space-x-4 py-5 text-48px font-bold">
                <Image src={chainIcon} alt={`${chainName}_icon`} width={60} height={60} />
                <h1>{chainName}</h1>
              </div>
              {/* Info: (20230904 - Julian) Tabs */}
              <div className="flex items-center space-x-6 py-10">
                <div
                  className={`flex items-center border-b-2 px-3 py-2 text-base ${
                    activeTab === 'blocks'
                      ? 'border-lightBlue text-primaryBlue'
                      : 'text-lightWhite1 border-darkPurple4'
                  } transition-all duration-300 ease-in-out`}
                >
                  <button onClick={blockTabCilckHandler}>{t('BREADCRUMB.BLOCKS')}</button>
                </div>
                <div
                  className={`flex items-center border-b-2 px-3 py-2 text-base ${
                    activeTab === 'transactions'
                      ? 'border-lightBlue text-primaryBlue'
                      : 'text-lightWhite1 border-darkPurple4'
                  } transition-all duration-300 ease-in-out`}
                >
                  <button onClick={transactionTabCilckHandler}>
                    {t('BREADCRUMB.TRANSACTIONS')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  return {
    paths: [{params: {chainId: 'bolt'}}],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }

  const chainData = dummyChains.find(chain => chain.chainId === params.chainId);

  if (!chainData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chainId: params.chainId,
      chainData: chainData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ChainDetailPage;
