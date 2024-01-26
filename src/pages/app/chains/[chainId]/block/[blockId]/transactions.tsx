import Head from 'next/head';
import Image from 'next/image';
import {useEffect, useState, useContext, useRef} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import Footer from '../../../../../../components/footer/footer';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import TransactionTab from '../../../../../../components/transaction_tab/transaction_tab';
import {BsArrowLeftShort} from 'react-icons/bs';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {GetStaticPaths, GetStaticProps} from 'next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {getChainIcon} from '../../../../../../lib/common';
import {ITransaction} from '../../../../../../interfaces/transaction';

interface ITransitionsInBlockPageProps {
  chainId: string;
  blockId: string;
}

const TransitionsInBlockPage = ({chainId, blockId}: ITransitionsInBlockPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getTransactionList} = useContext(MarketContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactionData, setTransitionData] = useState<ITransaction[]>([]);

  const headTitle = `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_BLOCK')} ${blockId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getTransactionData = async (chainId: string, blockId: string) => {
      try {
        const data = await getTransactionList(chainId, blockId);
        setTransitionData(data);
      } catch (error) {
        //console.log('getTransactionList error', error);
      }
    };

    getTransactionData(chainId, blockId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (transactionData) {
      setTransitionData(transactionData);
    }
    timerRef.current = setTimeout(() => setIsLoading(false), 500);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [transactionData]);

  const displayedTransactions = !isLoading ? (
    <TransactionTab />
  ) : (
    // ToDo: (20231213 - Julian) Add loading animation
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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-28 lg:px-40">
            <div className="flex w-full items-center justify-start py-10">
              {/* Info: (20231211 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                {/* Info: (20231211 -Julian) Title */}
                <h1 className="text-2xl font-bold lg:text-48px">
                  <span className="text-primaryBlue">
                    {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}
                  </span>
                  {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_BLOCK')}
                </h1>
                {/* Info: (20231211 -Julian) Sub Title */}
                <div className="flex items-center space-x-2">
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
                  <h2 className="text-xl">
                    {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} {blockId}
                  </h2>
                </div>
              </div>
            </div>

            {/* Info: (20231211 - Julian) Transaction List */}
            {displayedTransactions}

            <div className="pt-10">
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
  // ToDo: (20231213 - Julian) Add dynamic paths
  const paths = [
    {
      params: {chainId: 'isun', blockId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.blockId || typeof params.blockId !== 'string') {
    return {
      notFound: true,
    };
  }

  const chainId = params.chainId;
  const blockId = params.blockId;

  if (!chainId || !blockId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chainId,
      blockId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default TransitionsInBlockPage;
