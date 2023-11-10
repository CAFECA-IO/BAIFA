import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import BoltButton from '../../../components/bolt_button/bolt_button';
import Footer from '../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';
import {IRedFlag} from '../../../interfaces/red_flag';
import {getChainIcon, timestampToString} from '../../../lib/common';
import Link from 'next/link';
import {BFAURL} from '../../../constants/url';
import {dummyAddressData} from '../../../interfaces/address';
import Tooltip from '../../../components/tooltip/tooltip';

interface IRedFlagDetailPageProps {
  redFlagData: IRedFlag;
}

const RedFlagDetailPage = ({redFlagData}: IRedFlagDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, addressId, addressHash, redFlagType, flaggingTimestamp, totalAmount} =
    redFlagData;

  const headTitle = `${'Red Flag '} ${'Address'} - BAIFA`;
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
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231110 - Julian) Header */}
            <div className="flex w-full items-center justify-start">
              {/* Info: (20231110 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231110 -Julian) Red Flag Address Title */}
              <div className="flex flex-1 items-center justify-center space-x-4 text-2xl font-bold lg:text-32px">
                <h1>{t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')}</h1>
                <Image src={chainIcon.src} alt={chainIcon.alt} width={40} height={40} />
                <h1>
                  {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="text-primaryBlue"> {addressId}</span>
                </h1>
              </div>
            </div>

            <div className="my-10 flex w-full flex-col items-center gap-4 sm:w-1/2 lg:flex-row">
              {/* Info: (20231110 - Julian) Download Report Button */}
              <Link href={BFAURL.COMING_SOON} className="w-full">
                <BoltButton
                  className="flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                  color="purple"
                  style="solid"
                >
                  <Image src="/icons/download.svg" alt="" width={24} height={24} />
                  <p>Download Report</p>
                </BoltButton>
              </Link>
              {/* Info: (20231110 - Julian) Open in Tracing Tool Button */}
              <Link href={BFAURL.COMING_SOON} className="w-full">
                <BoltButton
                  className="flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                  color="purple"
                  style="solid"
                >
                  <Image src="/icons/tracing.svg" alt="" width={24} height={24} />
                  <p>Open in Tracing Tool</p>
                </BoltButton>
              </Link>
            </div>

            {/* Info: (20231110 - Julian) */}
            <div className="my-10 w-full">
              {/* Info: (20231110 - Julian) Red Flag Detail */}
              <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
                {/* Info: (20231110 - Julian) Address Hash */}
                <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
                  <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
                    <p>{t('BLOCK_DETAIL_PAGE.STABILITY')}</p>
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                  </div>
                  {addressHash}
                </div>
                {/* Info: (20231110 - Julian) Red Flag Type */}
                <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
                  <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
                    <p>Red Flag Type</p>
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/red_flag.svg" alt="red_flag_icon" width={24} height={24} />
                    <p>{t(redFlagType)}</p>
                  </div>
                </div>

                {/* Info: (20231110 - Julian) Flagging Time */}
                <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
                  <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
                    Flagging Time
                  </p>
                  <div className="flex items-center gap-2">
                    <p>{timestampToString(flaggingTimestamp).date}</p>
                    <p>{timestampToString(flaggingTimestamp).time}</p>
                  </div>
                </div>
                {/* Info: (20231110 - Julian) Interacted with */}
                <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
                  <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
                    <p>Interacted with</p>
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap items-center space-x-3">{}</div>
                </div>
                {/* Info: (20231110 - Julian) Total Amount */}
                <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
                  <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
                    <p>Total Amount</p>
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image src={chainIcon.src} alt={chainIcon.alt} width={24} height={24} />
                    <p>{totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full"></div>

            {/* Info: (20231110 - Julian) Back Button */}
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
