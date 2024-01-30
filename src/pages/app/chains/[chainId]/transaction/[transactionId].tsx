import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../components/nav_bar/nav_bar';
import TransactionDetail from '../../../../../components/transaction_detail/transaction_detail';
import BoltButton from '../../../../../components/bolt_button/bolt_button';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import Footer from '../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ITransactionDetail} from '../../../../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../interfaces/locale';
import {BFAURL} from '../../../../../constants/url';
import {AppContext} from '../../../../../contexts/app_context';
import {MarketContext} from '../../../../../contexts/market_context';
import {getChainIcon} from '../../../../../lib/common';

interface ITransactionDetailPageProps {
  transactionId: string;
  chainId: string;
}

const TransactionDetailPage = ({transactionId, chainId}: ITransactionDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getTransactionDetail} = useContext(MarketContext);

  const headTitle = `${t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')} ${transactionId} - BAIFA`;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<ITransactionDetail>(
    {} as ITransactionDetail
  );

  const chainIcon = getChainIcon(chainId);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getTransactionData = async (chainId: string, blockId: string) => {
      try {
        const data = await getTransactionDetail(chainId, blockId);
        setTransactionData(data);
      } catch (error) {
        //console.log('getBlockDetail error', error);
      }
    };

    getTransactionData(chainId, transactionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);

    if (transactionData) {
      setTransactionData(transactionData);
    }
    timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [transactionData]);

  const backClickHandler = () => router.back();

  // Info: (20240130 - Julian) 如果拿不到 transactionData，就顯示 Data not found
  if (!transactionData.id) return <h1>Data not found</h1>;

  // Info: (20231017 - Julian) 有 flagging 的話，就顯示 Add in Tracing Tool 按鈕
  const isAddInTracingTool =
    !!transactionData.flaggingRecords && transactionData.flaggingRecords.length !== 0
      ? 'block'
      : 'hidden';

  const displayedHeader = !isLoading ? (
    <div className="relative flex w-full flex-col items-center justify-start lg:flex-row">
      {/* Info: (20230912 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {/* Info: (20230912 -Julian) Transaction Title */}
      <div className="flex flex-1 items-center justify-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={40} height={40} />
        <h1 className="text-2xl font-bold lg:text-32px">
          {t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')}
          <span className="ml-2 text-primaryBlue"> {transactionId}</span>
        </h1>
      </div>

      {/* Info: (20231017 - Julian) Tracing Tool Button */}
      <div className={`relative right-0 mt-6 lg:mt-0 xl:absolute ${isAddInTracingTool}`}>
        <Link href={BFAURL.COMING_SOON}>
          <BoltButton
            className="group flex items-center space-x-4 px-6 py-4"
            color="purple"
            style="solid"
          >
            <Image
              src="/icons/tracing.svg"
              alt=""
              width={24}
              height={24}
              className="invert group-hover:invert-0"
            />
            <p>{t('COMMON.TRACING_TOOL_BUTTON')}</p>
          </BoltButton>
        </Link>
      </div>
    </div>
  ) : (
    // ToDo: (20231213 - Julian) Loading Animation
    <></>
  );

  const displayedTransactionDetail = !isLoading ? (
    <TransactionDetail transactionData={transactionData} />
  ) : (
    // ToDo: (20231213 - Julian) Loading Animation
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
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231017 - Julian) Header */}
            {displayedHeader}

            {/* Info: (20230907 - Julian) Transaction Detail */}
            <div className="my-10 w-full">{displayedTransactionDetail}</div>

            <div className="w-full">
              <PrivateNoteSection />
            </div>

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

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  // ToDo: (20231213 - Julian) Add dynamic paths
  const paths = [
    {
      params: {chainId: 'isun', transactionId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.transactionId || typeof params.transactionId !== 'string') {
    return {
      notFound: true,
    };
  }

  const transactionId = params.transactionId;
  const chainId = params.chainId;

  if (!transactionId || !chainId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      transactionId,
      chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default TransactionDetailPage;
