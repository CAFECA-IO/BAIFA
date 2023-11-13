import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import RedFlagDetail from '../../../components/red_flag_detail/red_flag_detail';
import BoltButton from '../../../components/bolt_button/bolt_button';
import FlaggingTransactionListSection from '../../../components/flagging_transaction_list_section/flagging_transaction_list_section';
import Footer from '../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';
import {IRedFlag} from '../../../interfaces/red_flag';
import {getChainIcon} from '../../../lib/common';
import {BFAURL} from '../../../constants/url';
import {dummyAddressData} from '../../../interfaces/address';
import {dummyTransactionData} from '../../../interfaces/transaction';

interface IRedFlagDetailPageProps {
  redFlagData: IRedFlag;
}

const RedFlagDetailPage = ({redFlagData}: IRedFlagDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, addressId, transactionIds} = redFlagData;
  const transactions = dummyTransactionData.filter(transaction =>
    transactionIds.includes(transaction.id)
  );

  const headTitle = `${t('RED_FLAG_ADDRESS_PAGE.MAIN_TITLE')} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231110 - Julian) Header */}
            <div className="flex w-full items-center justify-start">
              {/* Info: (20231110 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231110 -Julian) Red Flag Address Title */}
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-2xl font-bold lg:flex-row lg:text-32px">
                <h1>{t('RED_FLAG_ADDRESS_PAGE.RED_FLAG')}</h1>
                <div className="flex items-center justify-center gap-4">
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={40} height={40} />
                  <h1>
                    {t('RED_FLAG_ADDRESS_PAGE.ADDRESS')}
                    <span className="text-primaryBlue"> {addressId}</span>
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
              {/* Info: (20231110 - Julian) Download Report Button */}
              <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
                <BoltButton
                  className="flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                  color="purple"
                  style="solid"
                >
                  <Image src="/icons/download.svg" alt="" width={24} height={24} />
                  <p>{t('RED_FLAG_ADDRESS_PAGE.DOWNLOAD_REPORT_BUTTON')}</p>
                </BoltButton>
              </Link>
              {/* Info: (20231110 - Julian) Open in Tracing Tool Button */}
              <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
                <BoltButton
                  className="flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                  color="purple"
                  style="solid"
                >
                  <Image src="/icons/tracing.svg" alt="" width={24} height={24} />
                  <p>{t('RED_FLAG_ADDRESS_PAGE.OPEN_IN_TRACING_TOOL_BUTTON')}</p>
                </BoltButton>
              </Link>
            </div>

            {/* Info: (20231110 - Julian)  Red Flag Detail */}
            <div className="w-full">
              <RedFlagDetail redFlagData={redFlagData} />
            </div>

            {/* Info: (20231110 - Julian)  Transaction List */}
            <div className="w-full">
              <FlaggingTransactionListSection transactions={transactions} />
            </div>

            {/* Info: (20231110 - Julian) Back Button */}
            <div className="">
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
  const dummyAllRedFlags = dummyAddressData.flatMap(addressData => addressData.flagging);

  const paths = dummyAllRedFlags
    .flatMap(redFlag => {
      return locales?.map(locale => ({
        params: {redFlagId: `${redFlag.id}`},
        locale,
      }));
    })
    .filter((path): path is {params: {redFlagId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.redFlagId || typeof params.redFlagId !== 'string') {
    return {
      notFound: true,
    };
  }

  const dummyAllRedFlags = dummyAddressData.flatMap(addressData => addressData.flagging);
  const redFlagData = dummyAllRedFlags.find(redFlag => `${redFlag.id}` === params.redFlagId);

  if (!redFlagData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      redFlagData: redFlagData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default RedFlagDetailPage;
