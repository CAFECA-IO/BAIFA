import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState, useContext, useEffect, useRef} from 'react';
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import Tooltip from '../../../../../../components/tooltip/tooltip';
import AddressDetail from '../../../../../../components/address_detail/address_detail';
import PrivateNoteSection from '../../../../../../components/private_note_section/private_note_section';
import ReviewItem from '../../../../../../components/review_item/review_item';
import LeaveReviewButton from '../../../../../../components/leave_review_button/leave_review_button';
import Footer from '../../../../../../components/footer/footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {IAddressBrief} from '../../../../../../interfaces/address';
import {BFAURL, getDynamicUrl} from '../../../../../../constants/url';
import {AiOutlinePlus} from 'react-icons/ai';
import BlockProducedHistorySection from '../../../../../../components/block_produced_section/block_produced_section';
import TransactionHistorySection, {
  TransactionDataType,
} from '../../../../../../components/transaction_history_section/transaction_history_section';
import {MarketContext} from '../../../../../../contexts/market_context';
import {AppContext} from '../../../../../../contexts/app_context';
import SortingMenu from '../../../../../../components/sorting_menu/sorting_menu';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_TRUNCATE_LENGTH,
  ITEM_PER_PAGE,
  sortOldAndNewOptions,
} from '../../../../../../constants/config';
import {getChainIcon, roundToDecimal, truncateText} from '../../../../../../lib/common';
import {ITransaction} from '../../../../../../interfaces/transaction';
import {IProductionBlock} from '../../../../../../interfaces/block';
import {SortingType} from '../../../../../../constants/api_request';
import {isAddress} from 'web3-validator';
import {IReviewDetail, IReviews} from '../../../../../../interfaces/review';
import useStateRef from 'react-usestateref';
import {
  AddressDetailsContext,
  AddressDetailsProvider,
} from '../../../../../../contexts/address_details_context';
import Skeleton from '../../../../../../components/skeleton/skeleton';
import {validate, getAddressInfo} from 'bitcoin-address-validation';

interface IAddressDetailDetailPageProps {
  addressId: string;
  chainId: string;
}

const AddressDetailPage = ({addressId, chainId}: IAddressDetailDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const {getAddressBrief} = useContext(MarketContext);
  const addressDetailsCtx = useContext(AddressDetailsContext);

  const [isLoading, setIsLoading] = useState(true);
  const [addressBriefData, setAddressBriefData] = useState<IAddressBrief>({} as IAddressBrief);
  const [reviewSorting, setReviewSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [transactionData, setTransactionData] = useState<ITransaction[]>([]);

  const {publicTag, score} = addressBriefData;

  const headTitle = `${t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} ${addressId} - BAIFA`;

  const reviewData: IReviewDetail[] = [];

  const chainIcon = getChainIcon(chainId);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    // const getAddressBriefData = async (chainId: string, addressId: string) => {
    //   try {
    //     const data = await getAddressBrief(chainId, addressId);
    //     setAddressBriefData(data);
    //   } catch (error) {
    //     //console.log('getAddressData error', error);
    //   } finally {
    //   }
    // };

    // (async () => {
    //   setIsLoading(true);

    //   await getAddressBriefData(chainId, addressId);
    // })();

    initData(
      chainId,
      addressId,
      router?.query?.blocks_page as string,
      router?.query?.transaction_page as string
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // TODO: validate BTC address (20240207 - Shirley)
    // eslint-disable-next-line no-console
    // console.log('addressId is valid', isAddress(addressId), addressId);

    if (addressBriefData) {
      setAddressBriefData(addressBriefData);
      setIsLoading(false);
    }
  }, [addressBriefData]);

  const initData = async (
    chainId: string,
    addressId: string,
    blocks_page?: string,
    transaction_page?: string
  ) => {
    // eslint-disable-next-line no-console
    console.log('initData called', chainId, addressId, blocks_page, transaction_page);

    const blockPage = !!blocks_page ? parseInt(blocks_page) : 1;
    const transactionPage = !!transaction_page ? parseInt(transaction_page) : 1;

    await addressDetailsCtx.addressBriefInit(chainId, addressId);

    // await addressDetailsCtx.blockInit(chainId, addressId, {
    //   page: blockPage,
    //   offset: ITEM_PER_PAGE,
    //   order: SortingType.DESC,
    // });
    // await addressDetailsCtx.transactionInit(chainId, addressId, {
    //   page: transactionPage,
    //   offset: ITEM_PER_PAGE,
    //   order: SortingType.DESC,
    // });
  };

  useEffect(() => {
    initData(
      chainId,
      addressId,
      router.query.blocks_page as string,
      router.query.transaction_page as string
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, addressId, addressDetailsCtx]);

  const backClickHandler = () => router.back();

  const reviewLink = getDynamicUrl(chainId, addressId).REVIEWS;
  const reviewList =
    reviewData.length > 0 ? (
      reviewData
        // Info: (20231214 - Julian) Sort reviews by createdTimestamp
        .sort((a, b) => {
          if (reviewSorting === sortOldAndNewOptions[0]) {
            return b.createdTimestamp - a.createdTimestamp;
          } else {
            return a.createdTimestamp - b.createdTimestamp;
          }
        })
        // Info: (20231214 - Julian) Print reviews
        .map((review, index) => <ReviewItem key={index} review={review} />)
    ) : (
      <></>
    );

  const displayPublicTag = publicTag ? (
    publicTag.map((tag, index) => (
      <div
        key={index}
        className="whitespace-nowrap rounded border border-hoverWhite px-4 py-2 text-sm font-bold"
      >
        {t(tag)}
      </div>
    ))
  ) : (
    <></>
  );

  const displayedHeader = (
    <div className="flex w-full items-center justify-start">
      {/* Info: (20230912 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {/* Info: (20230912 -Julian) Address Title */}
      <div className="flex flex-1 items-center justify-center space-x-2">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={40}
          height={40}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <h1 className="text-2xl font-bold lg:text-32px">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
          <span title={addressId} className="ml-2 text-primaryBlue">
            {truncateText(addressId, DEFAULT_TRUNCATE_LENGTH)}
          </span>
        </h1>
      </div>
    </div>
  );

  const displayedAddressDetail = (
    <AddressDetail
      addressData={addressDetailsCtx.addressBrief}
      isLoading={addressDetailsCtx.addressBriefLoading}
    />
  );

  const displayedTransactionHistory = (
    <TransactionHistorySection
      transactions={transactionData}
      dataType={TransactionDataType.ADDRESS_DETAILS}
    />
  );

  const displayedBlockProducedHistory = (
    <BlockProducedHistorySection
      blocks={addressDetailsCtx.producedBlocks.blockData}
      totalBlocks={addressDetailsCtx.producedBlocks.blockCount}
    />
  );

  const displayedReviewSection = (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex items-center text-xl text-lilac">
        <h2 className="text-xl text-lilac"> {t('REVIEWS_PAGE.TITLE')}</h2>

        {isLoading ? (
          <span className="ml-2">
            {' '}
            <Skeleton width={60} height={30} />
          </span>
        ) : (
          <span className="ml-2">({roundToDecimal(score, 1)}) </span>
        )}
      </div>
      <div className="flex w-full flex-col rounded bg-darkPurple p-4">
        {/* Info: (20231020 - Julian) Sort & Leave review button */}
        <div className="flex flex-col-reverse items-center justify-between lg:flex-row">
          <SortingMenu
            sortingOptions={sortOldAndNewOptions}
            sorting={reviewSorting}
            setSorting={setReviewSorting}
            bgColor="bg-darkPurple"
          />
          <LeaveReviewButton />
        </div>
        {/* Info: (20231020 - Julian) Reviews List */}
        <div className="my-6 flex flex-col space-y-4">{reviewList}</div>
        <div className="mx-auto py-5 text-sm underline underline-offset-2">
          <Link href={reviewLink}>{t('REVIEWS_PAGE.SEE_ALL')}</Link>
        </div>
      </div>
    </div>
  );

  return (
    <AddressDetailsProvider>
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
              <div className="my-4 flex w-full flex-col items-center space-y-10">
                {/* Info: (20231018 - Julian) Public Tag */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-base font-bold text-lilac">
                    {t('PUBLIC_TAG.TITLE')}&nbsp;
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                    &nbsp;:
                  </div>
                  <div className="">{displayPublicTag}</div>
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0">
                  {/* Info: (20231018 - Julian) Tracing Tool Button */}
                  <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
                    <BoltButton
                      className="group flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                      color="purple"
                      style="solid"
                    >
                      <Image
                        src="/icons/tracing.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="invert group-hover:invert-0"
                      />
                      <p>{t('COMMON.TRACING_TOOL_BUTTON')}</p>
                    </BoltButton>
                  </Link>
                  {/* Info: (20231018 - Julian) Follow Button */}
                  <Link href={BFAURL.COMING_SOON} className="w-full lg:w-fit">
                    <BoltButton
                      className="flex w-full items-center justify-center space-x-2 px-7 py-4 lg:w-fit"
                      color="purple"
                      style="solid"
                    >
                      <AiOutlinePlus className="text-2xl" />
                      <p>{t('COMMON.FOLLOW')}</p>
                    </BoltButton>
                  </Link>
                </div>
              </div>
              {/* Info: (20231020 - Julian) Address Detail */}
              <div className="my-10 w-full">{displayedAddressDetail}</div>
              {/* Info: (20231020 - Julian) Private Note Section */}
              <div className="w-full">
                <PrivateNoteSection />
              </div>
              {/* Info: (20231020 - Julian) Review Section */}
              <div className="mt-6 w-full">{displayedReviewSection}</div>
              {/* Info: (20231103 - Julian) Transaction History & Block Produced History */}
              <div className="my-10 flex w-full flex-col gap-14 lg:flex-row lg:items-start lg:gap-2">
                {displayedTransactionHistory}
                {displayedBlockProducedHistory}
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
    </AddressDetailsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const {addressId = '', chainId = ''} = query;
  const address = `${addressId}`;
  const validAddress = isAddress(address) || validate(address);

  // Info: Ensure addressId and chainId are strings for type safety (20240219 - Shirley)
  // TODO: check whether `addressId` and `chainId` is valid For BTC (20240219 - Shirley)
  if (typeof addressId !== 'string' || !validAddress || typeof chainId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      addressId,
      chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default AddressDetailPage;

/* Deprecated: (20240219 - Shirley) use `getServerSideProps` instead of `getStaticPaths` and `getStaticProps`
// export const getStaticPaths: GetStaticPaths = async () => {
//   // ToDo: (20231213 - Julian) Add dynamic paths
//   const paths = [
//     {
//       params: {chainId: 'isun', addressId: '1'},
//       locale: 'en',
//     },
//   ];

//   return {paths, fallback: 'blocking'};
// };

// export const getStaticProps: GetStaticProps = async ({params, locale}) => {
//   if (!params || !params.addressId || typeof params.addressId !== 'string') {
//     return {
//       notFound: true,
//     };
//   }

//   const addressId = params.addressId;
//   const chainId = params.chainId;

//   if (!addressId || !isAddress(addressId) || !chainId) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       addressId,
//       chainId,
//       ...(await serverSideTranslations(locale as string, ['common'])),
//     },
//   };
// };
*/
