import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect, useContext} from 'react';
import useStateRef from 'react-usestateref';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import {SearchBarWithKeyDown} from '../../../../../../components/search_bar/search_bar';
import SortingMenu from '../../../../../../components/sorting_menu/sorting_menu';
import DatePicker from '../../../../../../components/date_picker/date_picker';
import InteractionItem from '../../../../../../components/interaction_item/interaction_item';
import Footer from '../../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getChainIcon} from '../../../../../../lib/common';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {IInteractionList} from '../../../../../../interfaces/interaction_item';
import {
  DEFAULT_CHAIN_ICON,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortMostAndLeastOptions,
} from '../../../../../../constants/config';
import Pagination from '../../../../../../components/pagination/pagination';
import {AppContext} from '../../../../../../contexts/app_context';
import {APIURL, HttpMethod} from '../../../../../../constants/api_request';
import Skeleton from '../../../../../../components/skeleton/skeleton';
import useAPIResponse from '../../../../../../lib/hooks/use_api_response';
import DataNotFound from '../../../../../../components/data_not_found/data_not_found';

interface IInteractionPageProps {
  addressId: string;
  chainId: string;
}

// Info: (20231108 - Julian) 將 type 整理成查詢用的字串(queryString)和顯示用的文字(text)
const typeOptions = [
  {
    queryString: 'all',
    text: 'SORTING.ALL',
  },
  {
    queryString: 'address',
    text: 'ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS',
  },
  {
    queryString: 'contract',
    text: 'CONTRACT_DETAIL_PAGE.MAIN_TITLE',
  },
];

const textToQueryOptionsMap = {
  'SORTING.ALL': 'all',
  'ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS': 'address',
  'CONTRACT_DETAIL_PAGE.MAIN_TITLE': 'contract',
};

const queryToTextOptionsMap = {
  all: 'SORTING.ALL',
  address: 'ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS',
  contract: 'CONTRACT_DETAIL_PAGE.MAIN_TITLE',
};

const InteractionPageSkeleton = () => {
  const listSkeletons = Array.from({length: ITEM_PER_PAGE}, (_, i) => (
    <div
      key={i}
      className="flex h-60px w-full items-center space-x-4 border-b border-darkPurple4 p-2"
    >
      {/* Info: (20231108 - Julian) Public Tag */}
      <div className="whitespace-nowrap rounded px-4 py-2 text-sm lg:text-base">
        <Skeleton width={100} height={40} />
      </div>
      {/* Info: (20231108 - Julian) Address/Contract ID */}
      <div className="flex w-120px items-center justify-start space-x-2 lg:w-full">
        <Skeleton width={250} height={40} />
      </div>
      <div className="hidden items-center lg:flex">
        <Skeleton width={120} height={40} />
      </div>{' '}
    </div>
  ));

  return (
    <>
      {/* Info: (20240227 - Shirley) Search Filter */}
      <div className="flex w-full flex-col items-end space-y-10">
        {/* Info: (20240227 - Shirley) Search Bar */}
        <div className="mx-auto flex w-full justify-center">
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

const InteractionPage = ({addressId, chainId}: IInteractionPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {type} = router.query;
  const appCtx = useContext(AppContext);

  // Info: (20231108 - Julian) Type Url Query
  const headTitle = `${t('INTERACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}${t(
    'INTERACTION_LIST_PAGE.MAIN_TITLE'
  )} ${t('COMMON.OF')} ${t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  // Info: (20231214 - Julian) SortingMenu 選項的顯示文字
  const sortingOptions = typeOptions.map(typeOption => typeOption.text);

  const backClickHandler = () => router.back();

  const [filteredType, setFilteredType, filteredTypeRef] = useStateRef<string>(
    queryToTextOptionsMap[type as keyof typeof queryToTextOptionsMap] ?? 'all'
  );
  // Info: (20231214 - Julian) Search Filter
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortMostAndLeastOptions[0]);
  const [period, setPeriod] = useState(default30DayPeriod);

  // Info: (20231214 - Julian) Pagination
  const [activePage, setActivePage] = useState<number>(1);

  const {
    data: interactedList,
    isLoading,
    error: interactedListError,
  } = useAPIResponse<IInteractionList>(
    `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/interactions`,
    {method: HttpMethod.GET},
    // TODO: API query options (20240227 - Shirley)
    {
      type:
        textToQueryOptionsMap[filteredTypeRef.current as keyof typeof textToQueryOptionsMap] ??
        'all',

      sort: sorting,
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
      page: activePage,
      offset: ITEM_PER_PAGE,
    }
  );

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filteredType) {
      router.query.type =
        textToQueryOptionsMap[filteredTypeRef.current as keyof typeof textToQueryOptionsMap]; // Update the query param
      router.push(router); // Refresh the page with the new query param
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTypeRef.current]);

  useEffect(() => {
    setFilteredType(queryToTextOptionsMap[type as keyof typeof queryToTextOptionsMap] ?? 'all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const displayedHeader = (
    <div className="flex w-full items-center justify-start">
      {/* Info: (20231108 -Julian) Back Arrow Button */}
      <button onClick={backClickHandler} className="hidden lg:block">
        <BsArrowLeftShort className="text-48px" />
      </button>
      {/* Info: (20231108 -Julian) Interaction Title */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-6 lg:w-auto">
        <h1 className="text-2xl font-bold lg:text-48px">
          <span className="text-primaryBlue">
            {t('INTERACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}
          </span>
          {t('INTERACTION_LIST_PAGE.MAIN_TITLE')}
        </h1>

        <div className="flex w-full flex-1 items-center justify-center space-x-2 whitespace-nowrap">
          {!isLoading ? (
            <div className="flex w-200px grow items-center justify-center space-x-2 text-xl">
              <Image
                src={chainIcon.src}
                alt={chainIcon.alt}
                width={30}
                height={30}
                onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
              />
              <p className="overflow-hidden text-ellipsis" title={addressId}>
                {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}
                <span> {addressId}</span>
              </p>
            </div>
          ) : (
            <Skeleton width={200} height={40} />
          )}
        </div>
      </div>
    </div>
  );

  const {interactedData, totalPages} = interactedList ?? {interactedData: [], totalPages: 1};

  const displayInteractedList = interactedData.map((interactedData, index) => (
    <InteractionItem key={index} orignalAddressId={addressId} interactedData={interactedData} />
  ));

  const displayedUI = interactedListError ? (
    // Info: (20240312 - Julian) If there is an error, display data not found
    <DataNotFound />
  ) : !isLoading ? (
    <>
      {/* Info: (20231108 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-end space-y-10">
        {/* Info: (20231108 - Julian) Search Bar */}
        <div className="mx-auto w-full lg:w-7/10">
          <SearchBarWithKeyDown
            searchBarPlaceholder={t('INTERACTION_LIST_PAGE.SEARCH_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:h-72px lg:flex-row lg:justify-between">
          {/* Info: (20231108 - Julian) Type Select Menu */}
          <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
            <SortingMenu
              sortingOptions={sortingOptions}
              sorting={filteredType}
              setSorting={setFilteredType}
              bgColor="bg-darkPurple"
            />
          </div>
          {/* Info: (20231108 - Julian) Date Picker */}
          <div className="flex w-full items-center text-sm lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker period={period} setFilteredPeriod={setPeriod} />
          </div>
          {/* Info: (20231108 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center text-sm lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortMostAndLeastOptions}
              sorting={sorting}
              setSorting={setSorting}
              bgColor="bg-darkPurple"
            />
          </div>
        </div>
      </div>

      {/* Info: (20231108 - Julian) Interaction List */}
      <div className="flex w-full flex-col lg:mt-20">{displayInteractedList}</div>
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </>
  ) : (
    <InteractionPageSkeleton />
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
            {/* Info: (20231108 - Julian) Header */}
            {displayedHeader}

            {displayedUI}
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default InteractionPage;

// export const getServerSideProps: GetStaticProps<IInteractionPageProps> = async ({
//   params,
//   locale,
// }) => {
//   const {addressId = '', chainId = '', type = ''} = params ?? {};

//   if (typeof addressId !== 'string' || typeof chainId !== 'string' || typeof type !== 'string') {
//     return {notFound: true};
//   }

//   return {
//     props: {
//       addressId,
//       chainId,
//       type,
//       ...(await serverSideTranslations(locale as string, ['common'])),
//     },
//   };
//   // if (!params || !params.addressId || typeof params.addressId !== 'string') {
//   //   return {
//   //     notFound: true,
//   //   };
//   // }
//   // if (!params || !params.chainId || typeof params.chainId !== 'string') {
//   //   return {
//   //     notFound: true,
//   //   };
//   // }

//   // const addressId = params.addressId;
//   // const chainId = params.chainId;

//   // return {
//   //   props: {addressId, chainId, ...(await serverSideTranslations(locale as string, ['common']))},
//   // };
// };

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

export const getStaticProps: GetStaticProps<IInteractionPageProps> = async ({params, locale}) => {
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
