import {useContext, useEffect} from 'react';
import {BsArrowLeftShort} from 'react-icons/bs';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {DEFAULT_CHAIN_ICON, DEFAULT_TRUNCATE_LENGTH} from '@/constants/config';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {ITransactionDetail, dummyTransactionDetail} from '@/interfaces/transaction';
import {getChainIcon, truncateText} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';
import {AppContext} from '@/contexts/app_context';
import NavBar from '@/components/nav_bar/nav_bar';
import TransactionDetail from '@/components/transaction_detail/transaction_detail';
import BoltButton from '@/components/bolt_button/bolt_button';
import PrivateNoteSection from '@/components/private_note_section/private_note_section';
import Footer from '@/components/footer/footer';
import DataNotFound from '@/components/data_not_found/data_not_found';

interface ITransactionDetailPageProps {
  transactionId: string;
  chainId: string;
}

const TransactionDetailPage = ({transactionId, chainId}: ITransactionDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);

  const headTitle = `${t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')} ${transactionId} - BAIFA`;

  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useAPIResponse<ITransactionDetail>(
    `${APIURL.CHAINS}/${chainId}/transactions/${transactionId}`,
    {method: HttpMethod.GET}
  );

  const chainIcon = getChainIcon(chainId);
  const backClickHandler = () => router.push(`${BFAURL.CHAINS}/${chainId}`);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20231017 - Julian) 有 flagging 的話，就顯示 Add in Tracking Tool 按鈕
  const isAddInTrackingTool =
    !!transactionData?.flaggingRecords && transactionData.flaggingRecords.length !== 0
      ? 'block'
      : 'hidden';

  const displayedHeader = (
    <div className="relative flex w-full flex-col items-center justify-start lg:flex-row">
      {/* Info: (20230912 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {/* Info: (20230912 -Julian) Transaction Title */}
      <div className="flex flex-1 items-center justify-center space-x-2">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={40}
          height={40}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <div className="text-2xl font-bold lg:inline-flex lg:text-32px" title={transactionId}>
          <span>{t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')}</span>
          <h1 className="text-primaryBlue lg:ml-2">
            {truncateText(transactionId, DEFAULT_TRUNCATE_LENGTH)}
          </h1>
        </div>
      </div>

      {/* Info: (20231017 - Julian) Tracking Tool Button */}
      <div className={`relative right-0 mt-6 lg:mt-0 xl:absolute ${isAddInTrackingTool}`}>
        <Link href={BFAURL.COMING_SOON}>
          <BoltButton
            className="group flex items-center space-x-4 px-6 py-4"
            color="purple"
            style="solid"
          >
            <Image
              src="/icons/tracking.svg"
              alt=""
              width={24}
              height={24}
              className="invert group-hover:invert-0"
            />
            <p>{t('COMMON.TRACKING_TOOL_BUTTON')}</p>
          </BoltButton>
        </Link>
      </div>
    </div>
  );

  // Info: (20240217 - Julian) 如果沒有資料，就顯示 DataNotFound
  const isTransactionData = !transactionError ? (
    <TransactionDetail
      isLoading={isTransactionLoading}
      transactionData={transactionData ?? dummyTransactionDetail}
    />
  ) : (
    <DataNotFound />
  );

  const isPrivateNoteSection = !transactionError ? <PrivateNoteSection /> : null;

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
            <div className="my-10 w-full">{isTransactionData}</div>

            <div className="w-full">{isPrivateNoteSection}</div>

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

export const getServerSideProps: GetServerSideProps = async ({params, locale}) => {
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
