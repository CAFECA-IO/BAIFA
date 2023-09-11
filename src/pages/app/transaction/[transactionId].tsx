import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import Footer from '../../../components/footer/footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyTransactionData, ITransactionData} from '../../../interfaces/transaction_data';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';

interface ITransactionDetailPageProps {
  transactionId: string;
  transactionData: ITransactionData;
}

const TransactionDetailPage = ({transactionId, transactionData}: ITransactionDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // ToDo: (20230908 - Julian) i18n
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>BAIFA - Transaction {transactionId}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-20 pt-28">
            <div className="flex w-full items-center justify-center py-10 text-32px font-bold">
              Transaction <span className="ml-2 text-primaryBlue">{transactionId}</span>
            </div>

            {/* Info: (20230907 - Julian) Transaction Detail */}
            <div className="flex w-4/5 flex-col rounded-lg bg-darkPurple p-5 shadow-xl">
              <div className="flex items-center text-base">
                <p className="w-150px text-lilac">Transaction Hash</p>
                <p>{transactionData.hash}</p>
              </div>
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
  const paths = dummyTransactionData
    .flatMap(transaction => {
      return locales?.map(locale => ({params: {transactionId: `${transaction.id}`}, locale}));
    })
    .filter((path): path is {params: {transactionId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.transactionId || typeof params.transactionId !== 'string') {
    return {
      notFound: true,
    };
  }

  const transactionData = dummyTransactionData.find(
    transaction => `${transaction.id}` === params.transactionId
  );

  if (!transactionData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      transactionId: params.transactionId,
      transactionData: transactionData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default TransactionDetailPage;
