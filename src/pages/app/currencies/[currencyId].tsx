import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../../../components/nav_bar/nav_bar';
import Footer from '../../../components/footer/footer';
import CurrencyDetail from '../../../components/currency_detail/currency_detail';
import {GetStaticPaths, GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ICurrency, dummyCurrencyData} from '../../../interfaces/currency';
import {BsArrowLeftShort} from 'react-icons/bs';
import {useRouter} from 'next/router';
import {getChainIcon} from '../../../lib/common';
import Top100HolderSection from '../../../components/top_100_holder_section/top_100_holder_section';
import TransactionHistorySection from '../../../components/transaction_history_section/transaction_history_section';
import BlockProducedHistorySection from '../../../components/block_produced_section/block_produced_section';
import BoltButton from '../../../components/bolt_button/bolt_button';
import {TranslateFunction} from '../../../interfaces/locale';
import {useTranslation} from 'react-i18next';

interface ICurrencyDetailPageProps {
  currencyId: string;
  currencyData: ICurrency;
}

const CurrencyDetailPage = ({currencyId, currencyData}: ICurrencyDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {currencyName, blocks, transactions, unit} = currencyData;
  const headTitle = `${currencyName} - BAIFA`;
  const chainIcon = getChainIcon(currencyId);

  const router = useRouter();
  const backClickHandler = () => router.back();

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
            <div className="flex w-full items-center justify-start">
              {/* Info: (20231018 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231018 -Julian) Block Title */}
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image src={chainIcon.src} alt={chainIcon.alt} width={40} height={40} />
                <h1 className="text-2xl font-bold lg:text-32px">
                  <span className="ml-2"> {currencyName}</span>
                </h1>
              </div>
            </div>

            {/* Info: (20231101 - Julian) Currency Detail */}
            <div className="my-10 w-full">
              <CurrencyDetail currencyData={currencyData} />
            </div>

            {/* Info: (20231101 - Julian) Top 100 Holder */}
            <div className="my-10 w-full">
              <Top100HolderSection currencyData={currencyData} />
            </div>

            {/* Info: (20231103 - Julian) Transaction History & Block Produced History */}
            <div className="my-10 flex w-full flex-col gap-14 lg:flex-row lg:items-start lg:gap-2">
              <TransactionHistorySection transactions={transactions} />
              <BlockProducedHistorySection blocks={blocks} unit={unit} />
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
  const paths = dummyCurrencyData
    .flatMap(currency => {
      return locales?.map(locale => ({
        params: {currencyId: `${currency.currencyId}`},
        locale,
      }));
    })
    .filter((path): path is {params: {currencyId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.currencyId || typeof params.currencyId !== 'string') {
    return {
      notFound: true,
    };
  }

  const currencyData = dummyCurrencyData.find(
    currency => `${currency.currencyId}` === params.currencyId
  );

  if (!currencyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      currencyId: params.currencyId,
      currencyData: currencyData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default CurrencyDetailPage;
