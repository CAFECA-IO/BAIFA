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
import {getChainIcon, truncateText} from '../../../../../../lib/common';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {IRedFlag} from '../../../../../../interfaces/red_flag';
import RedFlagList from '../../../../../../components/red_flag_list/red_flag_list';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_RED_FLAG_COUNT_IN_PAGE,
  DEFAULT_TRUNCATE_LENGTH,
} from '../../../../../../constants/config';
import Skeleton from '../../../../../../components/skeleton/skeleton';

interface IRedFlagOfAddressPageProps {
  chainId: string;
  addressId: string;
}

const RedFlagListSkeleton = () => {
  const listSkeletons = Array.from({length: DEFAULT_RED_FLAG_COUNT_IN_PAGE}, (_, i) => (
    <div key={i} className="flex w-full flex-col">
      <div className="flex h-60px w-full items-center">
        {/* Info: (20240227 - Shirley) Flagging Time square */}
        <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
          <Skeleton width={60} height={40} />{' '}
        </div>
        <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
          {/* Info: (20240227 - Shirley) Address ID */}
          <Skeleton width={150} height={40} /> {/* Info: (20240227 - Shirley) Flag Type */}
          <div className="flex w-full justify-end">
            <Skeleton width={80} height={40} />{' '}
          </div>
        </div>
      </div>{' '}
    </div>
  ));
  return (
    <>
      {/* Info: (20240227 - Shirley) Search Filter */}
      <div className="flex w-full flex-col items-end space-y-10">
        {/* Info: (20240227 - Shirley) Search Bar */}
        <div className="mx-auto my-5 flex w-full justify-center lg:w-7/10">
          <Skeleton width={800} height={40} />
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:h-72px lg:flex-row lg:justify-between">
          {/* Info: (20240227 - Shirley) Type Select Menu */}
          <div className="relative flex w-full items-center space-y-2 text-base lg:w-200px">
            <Skeleton width={1023} height={40} />
          </div>
          {/* Info: (20240227 - Shirley) Date Picker */}
          <div className="flex w-full items-center text-sm lg:w-220px lg:space-x-2">
            <Skeleton width={1023} height={40} />{' '}
          </div>
          {/* Info: (20240227 - Shirley) Sorting Menu */}
          <div className="relative flex w-full items-center text-sm lg:w-220px lg:space-x-2">
            <Skeleton width={1023} height={40} />
          </div>
        </div>
      </div>

      {/* Info: (20240227 - Shirley) Red Flag List */}
      <div className="mb-10 mt-16 flex w-full flex-col items-center space-y-0 lg:mt-10">
        {listSkeletons}
        {/* Info: Pagination (20240223 - Shirley) */}
      </div>
      <div className="flex w-full justify-center">
        <Skeleton width={200} height={40} />{' '}
      </div>
    </>
  );
};

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

  const getRedFlagData = async (chainId: string, addressId: string) => {
    try {
      const redFlagData = await getRedFlagsFromAddress(chainId, addressId);
      setRedFlagData(redFlagData);
    } catch (error) {
      // console.log('getRedFlagData error', error);
    }
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    (async () => {
      setIsLoading(true);
      await getRedFlagData(chainId, addressId);
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backClickHandler = () => router.back();

  const displayedRedFlagList = !isLoading ? (
    <RedFlagList redFlagData={redFlagData} />
  ) : (
    <RedFlagListSkeleton />
  );

  const displayedAddress = !isLoading ? (
    <div className="flex items-center space-x-2">
      <Image
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={30}
        height={30}
        onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
      />
      <p className="text-xl">
        {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {truncateText(addressId, DEFAULT_TRUNCATE_LENGTH)}
      </p>{' '}
    </div>
  ) : (
    <Skeleton width={250} height={30} />
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

                {displayedAddress}
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

export const getStaticPaths: GetStaticPaths = async () => {
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
