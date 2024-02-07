import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../../../../components/nav_bar/nav_bar';
import Footer from '../../../../components/footer/footer';
import CurrencyDetail from '../../../../components/currency_detail/currency_detail';
import {useContext, useEffect, useState} from 'react';
import {GetStaticPaths, GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ICurrencyDetail} from '../../../../interfaces/currency';
import {BsArrowLeftShort} from 'react-icons/bs';
import {useRouter} from 'next/router';
import Top100HolderSection from '../../../../components/top_100_holder_section/top_100_holder_section';
import TransactionHistorySection from '../../../../components/transaction_history_section/transaction_history_section';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import {TranslateFunction} from '../../../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {AppContext} from '../../../../contexts/app_context';
import {MarketContext} from '../../../../contexts/market_context';
import {getCurrencyIcon} from '../../../../lib/common';
import {DEFAULT_CURRENCY_ICON} from '../../../../constants/config';

interface ICurrencyDetailPageProps {
  currencyId: string;
}

const CurrencyDetailPage = ({currencyId}: ICurrencyDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getCurrencyDetail} = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currencyData, setCurrencyData] = useState<ICurrencyDetail>({} as ICurrencyDetail);

  const chainIcon = getCurrencyIcon(currencyId);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getCurrencyData = async (currencyId: string) => {
      try {
        const data = await getCurrencyDetail(currencyId);
        setCurrencyData(data);
      } catch (error) {
        //console.log('getBlockDetail error', error);
      }
    };

    getCurrencyData(currencyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currencyData.holders && currencyData.transactionHistoryData) {
      setCurrencyData(currencyData);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [currencyData]);

  const {currencyName, transactionHistoryData} = currencyData;
  const headTitle = `${currencyName} - BAIFA`;

  const backClickHandler = () => router.back();

  const displayedHeader = (
    <div className="flex w-full items-center justify-start">
      {/* Info: (20231018 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {/* Info: (20231018 -Julian) Block Title */}
      <div className="flex flex-1 items-center justify-center space-x-2">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={40}
          height={40} // Info: (20240206 - Julian) If the image fails to load, use the default currency icon
          onError={e => (e.currentTarget.src = DEFAULT_CURRENCY_ICON)}
        />
        <h1 className="text-2xl font-bold lg:text-32px">
          <span className="ml-2"> {currencyName}</span>
        </h1>
      </div>
    </div>
  );

  const displayedCurrencyDetail = !isLoading ? (
    <CurrencyDetail currencyData={currencyData} />
  ) : (
    // ToDo: (20231103 - Julian) Add loading animation
    <h1>Loading...</h1>
  );
  const displayedTop100Holder = !isLoading ? (
    <Top100HolderSection currencyData={currencyData} />
  ) : (
    // ToDo: (20231103 - Julian) Add loading animation
    <h1>Loading...</h1>
  );

  const displayedTransactionHistory = !isLoading ? (
    <TransactionHistorySection transactions={transactionHistoryData} />
  ) : (
    // ToDo: (20231103 - Julian) Add loading animation
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
            {/* Info: (20231018 - Julian) Header */}
            {displayedHeader}

            {/* Info: (20231101 - Julian) Currency Detail */}
            <div className="my-10 w-full">{displayedCurrencyDetail}</div>

            {/* Info: (20231101 - Julian) Top 100 Holder */}
            <div className="my-10 w-full">{displayedTop100Holder}</div>

            {/* Info: (20231103 - Julian) Transaction History */}
            <div className="my-10 flex w-full">{displayedTransactionHistory}</div>

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
      params: {currencyId: 'isun'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.currencyId || typeof params.currencyId !== 'string') {
    return {
      notFound: true,
    };
  }

  const currencyId = params.currencyId;

  return {
    props: {currencyId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default CurrencyDetailPage;
