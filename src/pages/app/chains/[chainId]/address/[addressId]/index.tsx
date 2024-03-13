import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState, useContext, useEffect} from 'react';
import {GetServerSideProps} from 'next';
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
import {
  IAddressBrief,
  IAddressProducedBlock,
  IAddressRelatedTransaction,
  dummyAddressBrief,
} from '../../../../../../interfaces/address';
import {BFAURL, getDynamicUrl} from '../../../../../../constants/url';
import {AiOutlinePlus} from 'react-icons/ai';
import BlockProducedHistorySection from '../../../../../../components/block_produced_section/block_produced_section';
import TransactionHistorySection, {
  TransactionDataType,
} from '../../../../../../components/transaction_history_section/transaction_history_section';
import {AppContext} from '../../../../../../contexts/app_context';
import SortingMenu from '../../../../../../components/sorting_menu/sorting_menu';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_PAGE,
  DEFAULT_REVIEWS_COUNT_IN_PAGE,
  DEFAULT_TRUNCATE_LENGTH,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../../../constants/config';
import {
  convertStringToSortingType,
  getChainIcon,
  roundToDecimal,
} from '../../../../../../lib/common';
import {ITransaction, ITransactionHistorySection} from '../../../../../../interfaces/transaction';
import {isAddress} from 'web3-validator';
import {IReviewDetail} from '../../../../../../interfaces/review';
import {
  AddressDetailsContext,
  AddressDetailsProvider,
} from '../../../../../../contexts/address_details_context';
import {validate} from 'bitcoin-address-validation';
import DataNotFound from '../../../../../../components/data_not_found/data_not_found';
import {APIURL, HttpMethod} from '../../../../../../constants/api_request';
import Skeleton from '../../../../../../components/skeleton/skeleton';
import useAPIResponse from '../../../../../../lib/hooks/use_api_response';
import {IDatePeriod} from '../../../../../../interfaces/date_period';

interface IAddressDetailDetailPageProps {
  addressId: string;
  chainId: string;
}

const AddressDetailSectionSkeleton = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231017 - Julian) Address Level */}
      <div className="flex flex-col space-y-2 px-3 py-4 text-sm lg:flex-row lg:items-center lg:space-y-0 lg:text-base">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.ADDRESS_TOOLTIP')}</Tooltip>
        </div>
        <Skeleton width={300} height={20} />
      </div>
      {/* Info: (20231017 - Julian) Sign Up time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.SIGN_UP_TIME')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.SIGN_UP_TIME_TOOLTIP')} </Tooltip>
        </div>
        <Skeleton width={200} height={20} />
      </div>
      {/* Info: (20231017 - Julian) Latest Active Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.LATEST_ACTIVE_TIME')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.LATEST_ACTIVE_TIME_TOOLTIP')} </Tooltip>
        </div>
        <Skeleton width={200} height={20} />
      </div>
      {/* Deprecated: (20240201 - Julian) Related Address */}
      {/* <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.RELATED_ADDRESS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="flex flex-wrap items-center gap-3">{displayRelatedAddress}</div>
      </div> */}
      {/* Info: (20231017 - Julian) Interacted With */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.INTERACTED_WITH')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.INTERACTED_WITH_TOOLTIP')} </Tooltip>
        </div>
        <Skeleton width={220} height={20} />
      </div>
      {/* Info: (20231017 - Julian) Red Flag */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('ADDRESS_DETAIL_PAGE.RED_FLAG')}</p>
          <Tooltip>{t('ADDRESS_DETAIL_PAGE.RED_FLAG_TOOLTIP')} </Tooltip>
        </div>
        <Skeleton width={200} height={20} />
      </div>
      {/* Info: (20231017 - Julian) Balance */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.BALANCE')}
        </p>
        <Skeleton width={200} height={20} />
      </div>
      {/* Info: (20231017 - Julian) Total Sent */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.TOTAL_SENT')}
        </p>
        <Skeleton width={200} height={20} />
      </div>
      {/* Info: (20231017 - Julian) Total Received */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('ADDRESS_DETAIL_PAGE.TOTAL_RECEIVED')}
        </p>
        <Skeleton width={200} height={20} />
      </div>
    </div>
  );
};

const ReviewSectionSkeleton = () => {
  return (
    <div className="flex flex-col items-start border-b border-darkPurple4 bg-darkPurple2 px-3 py-4 lg:h-100px lg:flex-row lg:items-center lg:p-5">
      {/* Info: (20231031 - Julian) Transaction & Stars */}
      <div className="flex flex-col items-start space-y-2">
        {/* Info: (20240221 - Shirley) hide transaction cause it's unnecessary */}
        {/* <Link href={transactionLink}>
          <BoltButton style="solid" color="purple" className="px-3 py-2 text-sm">
            {t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')} {transactionId}
          </BoltButton>
        </Link> */}
        <div className="flex w-100px items-center space-x-5px">
          <Skeleton width={100} height={30} />
        </div>
      </div>
      {/* Info: (20231031 - Julian) Divider */}
      <span className="my-2 h-px w-full bg-darkPurple4 lg:mx-10 lg:h-full lg:w-px"></span>
      {/* Info: (20231031 - Julian) Review Content */}
      <div className="line-clamp-3 flex-1 text-sm leading-5">
        <Skeleton width={300} height={30} />
      </div>
      {/* Info: (20231031 - Julian) Reviewer & Date */}
      <div className="mt-2 flex h-full flex-col items-start space-y-2 text-sm text-lilac lg:ml-10 lg:mt-0 lg:items-end lg:justify-between">
        <div>
          <Skeleton width={50} height={20} />
        </div>
        <div>
          <Skeleton width={200} height={20} />
        </div>
      </div>
    </div>
  );
};

const AddressDetailPage = ({addressId, chainId}: IAddressDetailDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const appCtx = useContext(AppContext);

  const {transaction_page, blocks_page} = router.query;

  const [reviewSorting, setReviewSorting] = useState<string>(sortOldAndNewOptions[0]);

  const [transactionActivePage, setTransactionActivePage] = useState<number>(
    transaction_page ? +transaction_page : DEFAULT_PAGE
  );
  const [transactionPeriod, setTransactionPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [transactionSorting, setTransactionSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [transactionSearch, setTransactionSearch] = useState<string>('');

  const [blocksActivePage, setBlocksActivePage] = useState<number>(
    blocks_page ? +blocks_page : DEFAULT_PAGE
  );
  const [blocksSorting, setBlocksSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [blocksPeriod, setBlocksPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [blocksSearch, setBlocksSearch] = useState<string>('');

  const {
    data: addressBriefData,
    isLoading: isAddressBriefLoading,
    error: addressBriefError,
  } = useAPIResponse<IAddressBrief>(`${APIURL.CHAINS}/${chainId}/addresses/${addressId}`, {
    method: HttpMethod.GET,
  });

  const {
    data: reviews,
    isLoading: reviewLoading,
    error: reviewsError,
  } = useAPIResponse<IReviewDetail[]>(
    `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/review_list`,
    {method: HttpMethod.GET},
    {sort: convertStringToSortingType(reviewSorting)}
  );

  const {
    data: transactionData,
    isLoading: isTransactionDataLoading,
    error: transactionDataError,
  } = useAPIResponse<IAddressRelatedTransaction>(
    `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/transactions`,
    {
      method: HttpMethod.GET,
    },
    {
      sort: convertStringToSortingType(transactionSorting),
      page: transactionActivePage,
      offset: ITEM_PER_PAGE,
      search: transactionSearch,
      start_date: transactionPeriod.startTimeStamp === 0 ? '' : transactionPeriod.startTimeStamp,
      end_date: transactionPeriod.endTimeStamp === 0 ? '' : transactionPeriod.endTimeStamp,
    }
  );

  const {data, isLoading, error} = useAPIResponse<string>(
    `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/transactions/suggestions`,
    {
      method: HttpMethod.GET,
    }
  );

  // eslint-disable-next-line no-console
  console.log(
    'in DetailedAddressPage: transactionData',
    transactionData,
    'transaction suggestions',
    data
  );

  const {
    data: blocksData,
    isLoading: isBlocksDataLoading,
    error: blocksDataError,
  } = useAPIResponse<IAddressProducedBlock>(
    `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/produced_blocks`,
    {
      method: HttpMethod.GET,
    },
    {
      sort: convertStringToSortingType(blocksSorting),
      page: blocksActivePage,
      offset: ITEM_PER_PAGE,
      search: blocksSearch,
      start_date: blocksPeriod.startTimeStamp === 0 ? '' : blocksPeriod.startTimeStamp,
      end_date: blocksPeriod.endTimeStamp === 0 ? '' : blocksPeriod.endTimeStamp,
    }
  );

  const {publicTag, score} = addressBriefData ?? ({} as IAddressBrief);

  const headTitle = `${t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')} ${addressId} - BAIFA`;

  const chainIcon = getChainIcon(chainId);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backClickHandler = () => router.back();

  const reviewLink = getDynamicUrl(chainId, addressId).REVIEWS;
  const reviewList = reviewLoading ? (
    Array.from({length: DEFAULT_REVIEWS_COUNT_IN_PAGE}, (_, index) => (
      <ReviewSectionSkeleton key={index} />
    ))
  ) : !!reviews && reviews.length > 0 ? (
    reviews
      .sort((a, b) => {
        if (reviewSorting === sortOldAndNewOptions[0]) {
          return b.createdTimestamp - a.createdTimestamp;
        } else {
          return a.createdTimestamp - b.createdTimestamp;
        }
      })
      .slice(0, DEFAULT_REVIEWS_COUNT_IN_PAGE)
      .map((review, index) => <ReviewItem key={index} review={review} />)
  ) : (
    <></>
  );

  const displayPublicTag = isAddressBriefLoading ? (
    <Skeleton width={150} height={40} />
  ) : publicTag ? (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
      {publicTag.map((tag, index) => (
        <div
          key={index}
          className="whitespace-nowrap rounded border border-hoverWhite px-4 py-2 text-sm font-bold"
        >
          {t(tag)}
        </div>
      ))}
    </div>
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
      <div className="inline-flex w-200px flex-1 items-center justify-center space-x-2 text-center text-primaryBlue lg:w-500px lg:px-10">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={40}
          height={40}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <h1
          title={addressId}
          className="grow overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold lg:text-32px"
        >
          <span className="text-hoverWhite">{t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')} </span>
          {addressId}
        </h1>
      </div>
    </div>
  );

  const displayedAddressDetail = isAddressBriefLoading ? (
    <AddressDetailSectionSkeleton />
  ) : addressBriefData ? (
    <AddressDetail addressData={addressBriefData} />
  ) : (
    <AddressDetail addressData={dummyAddressBrief} />
  );

  const displayedTransactionHistory = (
    <TransactionHistorySection
      transactions={transactionData?.transactions ?? []}
      activePage={transactionActivePage}
      setActivePage={setTransactionActivePage}
      sorting={transactionSorting}
      setSorting={setTransactionSorting}
      totalPage={transactionData?.totalPage ?? 0}
      isLoading={isTransactionDataLoading}
      transactionCount={transactionData?.transactionCount ?? 0}
      period={transactionPeriod}
      setPeriod={setTransactionPeriod}
      setSearch={setTransactionSearch}
    />
  );

  const displayedBlockProducedHistory = (
    <BlockProducedHistorySection
      blocks={blocksData?.blockData ?? []}
      blockCount={blocksData?.blockCount ?? 0}
      totalPages={blocksData?.totalPage ?? 0}
      activePage={blocksActivePage}
      setActivePage={setBlocksActivePage}
      sorting={blocksSorting}
      setSorting={setBlocksSorting}
      period={blocksPeriod}
      setPeriod={setBlocksPeriod}
      setSearch={setBlocksSearch}
      isLoading={isBlocksDataLoading}
    />
  );

  const displayedReviewSection = (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex items-center text-xl text-lilac">
        <h2 className="text-xl text-lilac"> {t('REVIEWS_PAGE.TITLE')}</h2>

        <span className="ml-2">({roundToDecimal(score, 1)}) </span>
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

  // TODO: check addresses of other chains (20240219 - Shirley)
  const isValidEVMAddress = isAddress(addressId);
  const displayedUI = isValidEVMAddress ? (
    <>
      <div className="my-4 flex w-full flex-col items-center space-y-10">
        {/* Info: (20231018 - Julian) Public Tag */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center whitespace-nowrap text-base font-bold text-lilac">
            {t('PUBLIC_TAG.TITLE')}&nbsp;
            <Tooltip>{t('ADDRESS_DETAIL_PAGE.PUBLIC_TAG_TOOLTIP')} </Tooltip>
            &nbsp;:
          </div>
          {displayPublicTag}
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
      {/* Info: (20240308 - Julian) Transaction History */}
      <div className="mt-6 w-full">{displayedTransactionHistory}</div>
      {/* Info: (20240308 - Julian) Block Produced History */}
      <div className="mt-6 w-full">{displayedBlockProducedHistory}</div>
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
    </>
  ) : (
    <div className="mt-20 w-full">
      {' '}
      <DataNotFound />
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

              {displayedUI}
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
  // TODO: 確認 addressId 跟 chainId 有對上，避免 EVM chain 但是是 BTC address (20240219 - Shirley)
  const validBTCAddress = validate(address);
  const validEVMAddress = isAddress(address);
  const validAddress = validEVMAddress || validBTCAddress;

  // Info: Ensure addressId and chainId are strings for type safety (20240219 - Shirley)
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
