import {useState, useEffect, useContext} from 'react';
import {BsArrowLeftShort} from 'react-icons/bs';
import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useRouter} from 'next/router';
import {IPaginationOptions, TimeSortingType} from '@/constants/api_request';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_PAGE,
  ITEM_PER_PAGE,
  sortOldAndNewOptions,
} from '@/constants/config';
import {getDynamicUrl} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {IReviews} from '@/interfaces/review';
import {convertStringToSortingType, getChainIcon} from '@/lib/common';
import {AppContext} from '@/contexts/app_context';
import {MarketContext} from '@/contexts/market_context';
import NavBar from '@/components/nav_bar/nav_bar';
import Footer from '@/components/footer/footer';
import ReviewSection from '@/components/review_section/review_section';
import Pagination from '@/components/pagination/pagination';

interface IReviewDetailsPageProps {
  addressId: string;
  chainId: string;
}

const ReviewsPage = ({addressId, chainId}: IReviewDetailsPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {page} = router.query;

  const appCtx = useContext(AppContext);
  const {getReviews} = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<IReviews>({} as IReviews);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  const [activePage, setActivePage] = useState<number>(page ? +page : DEFAULT_PAGE);

  const getReviewData = async (chainId: string, blockId: string, option: IPaginationOptions) => {
    try {
      const data = await getReviews(chainId, blockId, option);
      setReviews(data);
    } catch (error) {
      //console.log('getAddressData error', error);
    }
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    (async () => {
      const option = {
        sort: TimeSortingType.DESC,
        page: activePage,
        offset: ITEM_PER_PAGE,
      };
      setIsLoading(true);
      await getReviewData(chainId, addressId, option);
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const option = {
        sort: convertStringToSortingType(sorting),
        page: activePage,
        offset: ITEM_PER_PAGE,
      };
      setIsLoading(true);
      await getReviewData(chainId, addressId, option);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, activePage]);

  const headTitle = `${t('REVIEWS_PAGE.TITLE')} ${t('COMMON.OF')} ${t(
    'ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS'
  )} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.push(`${getDynamicUrl(chainId, addressId).ADDRESS}`);

  const displayedReviews = (
    <ReviewSection
      reviews={reviews}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
    />
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
            <div className="flex w-full items-center justify-start">
              {/* Info: (20231018 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231018 -Julian) Review Title */}
              <div className="flex w-full flex-1 flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl font-bold lg:text-48px">{t('REVIEWS_PAGE.TITLE')}</h1>
                <div className="flex w-full items-center justify-center space-x-2 text-center text-xl">
                  <div className="flex w-300px grow items-center justify-center space-x-2 lg:w-full">
                    <Image
                      src={chainIcon.src}
                      alt={chainIcon.alt}
                      width={30}
                      height={30}
                      onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                    />
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      title={addressId}
                    >
                      {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')} {addressId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info: (20231031 - Julian) Review List */}
            <div className="my-10 flex w-full flex-col lg:my-20">{displayedReviews}</div>

            {/* Info: (20231006 - Julian) Back button */}
            <Pagination
              activePage={activePage}
              setActivePage={setActivePage}
              totalPages={reviews.totalPages}
            />
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
      params: {chainId: 'isun', addressId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps<IReviewDetailsPageProps> = async ({params, locale}) => {
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
    props: {
      addressId,
      chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ReviewsPage;
