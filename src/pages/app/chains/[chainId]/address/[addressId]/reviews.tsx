import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import Footer from '../../../../../../components/footer/footer';
import ReviewSection from '../../../../../../components/review_section/review_section';
import {IReview, getDummyReviewData} from '../../../../../../interfaces/review';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getChainIcon} from '../../../../../../lib/common';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import {dummyAddressData} from '../../../../../../interfaces/address';

interface IReviewsPageProps {
  addressId: string;
  chainId: string;
  reviews: IReview[];
}

const ReviewsPage = ({addressId, chainId, reviews}: IReviewsPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('REVIEWS_PAGE.TITLE')} ${t('COMMON.OF')} ${t(
    'ADDRESS_DETAIL_PAGE.MAIN_TITLE'
  )} ${addressId} - BAIFA`;
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
                  <p className="text-xl">
                    {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId}
                  </p>
                </div>
              </div>
            </div>

            {/* Info: (20231031 - Julian) Review List */}
            <div className="mt-10 flex w-full flex-col lg:mt-20">
              <ReviewSection reviews={reviews} />
            </div>

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
  // ToDo: (20231031 - Julian) Get paths
  const paths = dummyAddressData
    .flatMap(address => {
      return locales?.map(locale => ({
        params: {chainId: `${address.chainId}`, addressId: `${address.id}`},
        locale,
      }));
    })
    .filter(
      (path): path is {params: {chainId: string; addressId: string}; locale: string} => !!path
    );

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IReviewsPageProps> = async ({params, locale}) => {
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

  const reviews = getDummyReviewData(params.addressId);

  if (!reviews) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      addressId: params.addressId,
      chainId: params.chainId,
      reviews,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ReviewsPage;
