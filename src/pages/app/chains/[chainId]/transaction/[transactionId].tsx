import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../components/nav_bar/nav_bar';
import TransactionDetail from '../../../../../components/transaction_detail/transaction_detail';
import BoltButton from '../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyTransactionData, ITransaction} from '../../../../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../interfaces/locale';
import {getChainIcon} from '../../../../../lib/common';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import Link from 'next/link';
import {BFAURL} from '../../../../../constants/url';

interface ITransactionDetailPageProps {
  transactionId: string;
  transactionData: ITransaction;
}

const TransactionDetailPage = ({transactionId, transactionData}: ITransactionDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')} ${transactionId} - BAIFA`;

  const router = useRouter();
  const backClickHandler = () => router.back();
  // Info: (20231017 - Julian) 有 flagging 的話就顯示 Add in Tracing Tool 按鈕
  const isAddInTracingTool = !!transactionData.flagging ? 'block' : 'hidden';

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
            <div className="relative flex w-full flex-col items-center justify-start lg:flex-row">
              {/* Info: (20230912 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20230912 -Julian) Transaction Title */}
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image
                  src={getChainIcon(transactionData.chainId).src}
                  alt={getChainIcon(transactionData.chainId).alt}
                  width={40}
                  height={40}
                />
                <h1 className="text-2xl font-bold lg:text-32px">
                  {t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue"> {transactionId}</span>
                </h1>
              </div>

              {/* Info: (20231017 - Julian) Tracing Tool Button */}
              <div className={`relative right-0 mt-6 lg:absolute lg:mt-0 ${isAddInTracingTool}`}>
                <Link href={BFAURL.COMING_SOON}>
                  <BoltButton
                    className="flex items-center space-x-4 px-6 py-4"
                    color="purple"
                    style="solid"
                  >
                    <Image src="/icons/tracing.svg" alt="" width={24} height={24} />
                    <p>{t('COMMON.TRACING_TOOL_BUTTON')}</p>
                  </BoltButton>
                </Link>
              </div>
            </div>

            {/* Info: (20230907 - Julian) Transaction Detail */}
            <div className="my-10 w-full">
              <TransactionDetail transactionData={transactionData} />
            </div>

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
  const paths = dummyTransactionData
    .flatMap(transaction => {
      return locales?.map(locale => ({
        params: {chainId: transaction.chainId, transactionId: `${transaction.id}`},
        locale,
      }));
    })
    .filter(
      (path): path is {params: {chainId: string; transactionId: string}; locale: string} => !!path
    );

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
