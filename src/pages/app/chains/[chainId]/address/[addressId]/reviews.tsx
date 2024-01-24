import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import Footer from '../../../../../../components/footer/footer';
import ReviewSection from '../../../../../../components/review_section/review_section';
import {IReviews} from '../../../../../../interfaces/review';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getChainIcon, truncateText} from '../../../../../../lib/common';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';

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

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getReviewData = async (chainId: string, blockId: string) => {
      try {
        const data = await getReviews(chainId, blockId);
        setReviews(data);
      } catch (error) {
        //console.log('getAddressData error', error);
      }
    };

    getReviewData(chainId, addressId);
  }, []);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);

    if (reviews) {
      setReviews(reviews);
    }
    timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [reviews]);

  const headTitle = `${t('REVIEWS_PAGE.TITLE')} ${t('COMMON.OF')} ${t(
    'ADDRESS_DETAIL_PAGE.MAIN_TITLE'
  )} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  const displayedReviews = !isLoading ? <ReviewSection reviews={reviews} /> : <h1>Loading...</h1>;

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
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
                  <p className="text-xl" title={addressId}>
                    {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {truncateText(addressId, 10)}
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
