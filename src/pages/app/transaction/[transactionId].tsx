import Head from 'next/head';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import TransactionDetail from '../../../components/transaction_detail/transaction_detail';
import BoltButton from '../../../components/bolt_button/bolt_button';
import Footer from '../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
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
  const headTitle = `${t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')} ${transactionId} - BAIFA`;

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
          <div className="flex w-4/5 flex-1 flex-col items-center space-y-10 px-20 pb-10 pt-28">
            <div className="flex w-full items-center justify-start py-10">
              {/* Info: (20230912 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler}>
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20230912 -Julian) Transaction Title */}
              <div className="flex flex-1 justify-center">
                {/* ToDo: (20230912 -Julian) Blockchain icon */}
                <h1 className="text-32px font-bold">
                  {t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue"> {transactionId}</span>
                </h1>
              </div>
            </div>

            {/* Info: (20230907 - Julian) Transaction Detail */}
            <TransactionDetail transactionData={transactionData} />

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
