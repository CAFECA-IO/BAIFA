import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect, useContext, useRef, use} from 'react';
import {useRouter} from 'next/router';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import Footer from '../../../../../../components/footer/footer';
import ReviewSection from '../../../../../../components/review_section/review_section';
import {IReviewDetail, IReviews} from '../../../../../../interfaces/review';
import {BsArrowLeftShort} from 'react-icons/bs';
import {convertStringToSortingType, getChainIcon, truncateText} from '../../../../../../lib/common';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_REVIEW_COUNT,
  DEFAULT_TRUNCATE_LENGTH,
  sortOldAndNewOptions,
} from '../../../../../../constants/config';
import ReviewItem from '../../../../../../components/review_item/review_item';
import Skeleton from '../../../../../../components/skeleton/skeleton';
import {SortingType} from '../../../../../../constants/api_request';

interface IReviewDetailsPageProps {
  addressId: string;
  chainId: string;
}

const ReviewsPage = ({addressId, chainId}: IReviewDetailsPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getReviews} = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<IReviews>({} as IReviews);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  // const getSoring = (sorting: string) => {
  //   const sortingType = convertStringToSortingType(sorting);
  //   // eslint-disable-next-line no-console
  //   console.log('sorting', sorting, 'sortingType', sortingType);
  //   getReviewData(chainId, addressId, sortingType);
  // };

  const getReviewData = async (chainId: string, blockId: string, order: SortingType) => {
    try {
      const data = await getReviews(chainId, blockId, order);
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
      setIsLoading(true);
      await getReviewData(chainId, addressId, SortingType.DESC);
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getReviewData(chainId, addressId, convertStringToSortingType(sorting));
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const headTitle = `${t('REVIEWS_PAGE.TITLE')} ${t('COMMON.OF')} ${t(
    'ADDRESS_DETAIL_PAGE.MAIN_TITLE'
  )} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  const displayedReviews = (
    // !isLoading ? (
    <ReviewSection
      reviews={reviews}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
    />
  );
  // ) : (
  // <div className="flex w-full flex-col space-y-4">
  //   <div className="flex w-full flex-col items-center justify-between space-y-10 rounded lg:flex-row lg:space-y-0">
  //     <h2 className="text-6xl">
  //       <Skeleton width={200} height={50} />
  //     </h2>
  //     {/* Info: (20231031 - Julian) Sort & Leave review button */}
  //     <div className="flex flex-col items-end space-y-10 lg:space-y-4">
  //       <Skeleton width={200} height={50} />
  //       <Skeleton width={200} height={50} />
  //     </div>
  //   </div>
  //   {/* Info: (20231031 - Julian) Reviews List */}
  //   <div className="my-6 flex flex-col space-y-4 lg:space-y-0">
  //     {Array.from({length: DEFAULT_REVIEW_COUNT}).map((_, index) => (
  //       <ReviewItem key={index} review={{} as IReviewDetail} />
  //     ))}
  //   </div>
  // </div>
  // );

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
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl font-bold lg:text-48px">{t('REVIEWS_PAGE.TITLE')}</h1>
                <div className="flex items-center space-x-2">
                  <Image
                    src={chainIcon.src}
                    alt={chainIcon.alt}
                    width={30}
                    height={30}
                    onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                  />
                  <p className="text-xl" title={addressId}>
                    {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}{' '}
                    {truncateText(addressId, DEFAULT_TRUNCATE_LENGTH)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info: (20231031 - Julian) Review List */}
            <div className="mt-10 flex w-full flex-col lg:mt-20">{displayedReviews}</div>

            {/* Info: (20231006 - Julian) Back button */}
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
