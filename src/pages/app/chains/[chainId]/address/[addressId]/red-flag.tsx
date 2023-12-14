import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getChainIcon} from '../../../../../../lib/common';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {IRedFlag} from '../../../../../../interfaces/red_flag';
import RedFlagList from '../../../../../../components/red_flag_list/red_flag_list';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';

interface IRedFlagOfAddressPageProps {
  chainId: string;
  addressId: string;
}

const RedFlagOfAddressPage = ({chainId, addressId}: IRedFlagOfAddressPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getRedFlagsFromAddress} = useContext(MarketContext);

  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} ${t('COMMON.OF')} ${t(
    'ADDRESS_DETAIL_PAGE.MAIN_TITLE'
  )} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [redFlagData, setRedFlagData] = useState<IRedFlag[]>([]);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getRedFlagData = async (chainId: string, addressId: string) => {
      const redFlagData = await getRedFlagsFromAddress(chainId, addressId);
      setRedFlagData(redFlagData);
    };

    getRedFlagData(chainId, addressId);
  }, []);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);

    if (redFlagData) {
      setRedFlagData(redFlagData);
    }
    timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [redFlagData]);

  const backClickHandler = () => router.back();

  const displayedRedFlagList = !isLoading ? (
    <RedFlagList redFlagData={redFlagData} />
  ) : (
    // ToDo: (20231214 - Julian) Add loading animation
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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231109 - Julian) Header */}
            <div className="flex w-full items-start justify-start">
              {/* Info: (20231109 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231109 -Julian) Red Flag Title */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl font-bold lg:text-48px">
                  <span className="text-lightRed">
                    {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}
                  </span>
                  {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE')}
                </h1>
                <div className="flex items-center space-x-2">
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
                  <p className="text-xl">
                    {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId}
                  </p>
                </div>
              </div>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="w-full">{displayedRedFlagList}</div>

            {/* Info: (20231109 - Julian) Back button */}
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

export default RedFlagOfAddressPage;

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  // ToDo: (20231213 - Julian) Add dynamic paths
  const paths = [
    {
      params: {chainId: 'isun', addressId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps<IRedFlagOfAddressPageProps> = async ({
  params,
  locale,
}) => {
  if (!params || !params.addressId || typeof params.addressId !== 'string') {
    return {
      notFound: true,
    };
  }
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }

  const addressId = params.addressId;
  const chainId = params.chainId;

  return {
    props: {addressId, chainId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};
