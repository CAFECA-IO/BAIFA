import Head from 'next/head';
import Image from 'next/image';
import useAPIResponse from '../../../../lib/hooks/use_api_response';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../../../contexts/app_context';
import {useRouter} from 'next/router';
import NavBar from '../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import Footer from '../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ITransactionList} from '../../../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../interfaces/locale';
import {convertStringToSortingType, getChainIcon, truncateText} from '../../../../lib/common';
import {GetStaticPaths, GetStaticProps} from 'next';
import TransactionList from '../../../../components/transaction_list/transaction_list';
import {SearchBarWithKeyDown} from '../../../../components/search_bar/search_bar';
import DatePicker from '../../../../components/date_picker/date_picker';
import SortingMenu from '../../../../components/sorting_menu/sorting_menu';
import Pagination from '../../../../components/pagination/pagination';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_TRUNCATE_LENGTH,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../constants/config';
import Skeleton from '../../../../components/skeleton/skeleton';
import {APIURL, HttpMethod} from '../../../../constants/api_request';

interface ITransactionsPageProps {
  chainId: string;
}

const TransactionsPage = ({chainId}: ITransactionsPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {addressId} = router.query;

  const appCtx = useContext(AppContext);

  const headTitle = `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_ADDRESS_1')} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  //  Info: (20231114 - Julian) 如果有取得 addressId，且 addressId 是陣列，則顯示資料
  const isAddressIds = !!addressId && typeof addressId === 'object';

  const addressIdA = isAddressIds ? addressId[0] : '';
  const addressIdB = isAddressIds ? addressId[1] : '';

  // Info: (20240223 - Julian) 搜尋條件
  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [activePage, setActivePage] = useState(1);

  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useAPIResponse<ITransactionList>(
    `${APIURL.CHAINS}/${chainId}/transactions`,
    {
      method: HttpMethod.GET,
    },
    {
      addressIdA: addressIdA,
      addressIdB: addressIdB,
      page: activePage,
      sort: convertStringToSortingType(sorting),
      search: search,
      start_date: period.startTimeStamp > 0 ? period.startTimeStamp : '',
      end_date: period.endTimeStamp > 0 ? period.endTimeStamp : '',
    }
  );

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainTitle = (
    <h1 className="text-2xl font-bold lg:text-48px">
      <span className="text-primaryBlue">{t('TRANSACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
      {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_ADDRESSES')}
    </h1>
  );

  const subTitle = isAddressIds ? (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={30}
          height={30}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <h2 title={addressId[0]} className="text-sm lg:text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}
          <span className="text-primaryBlue">
            {' '}
            {truncateText(addressId[0], DEFAULT_TRUNCATE_LENGTH)}
          </span>
        </h2>
      </div>
      <Image src="/icons/switch.svg" alt="" width={24} height={24} />
      <div className="flex items-center space-x-2">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={30}
          height={30}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <h2 title={addressId[1]} className="text-sm lg:text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}
          <span className="text-primaryBlue">
            {' '}
            {truncateText(addressId[1], DEFAULT_TRUNCATE_LENGTH)}
          </span>
        </h2>
      </div>
    </div>
  ) : (
    <></>
  );

  // Info: (20240223 - Julian) Loading animation
  const skeletonTransactionList = (
    <div className="flex h-680px w-full flex-col py-10">
      {Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <div
          key={index}
          className="flex h-60px w-full items-center gap-8 border-b border-darkPurple4 px-1"
        >
          <Skeleton width={50} height={50} />
          <Skeleton width={200} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  );

  const {transactions, totalPages} = transactionData ?? {transactions: [], totalPages: 0};

  const isShoeTransactionList = isTransactionLoading ? (
    skeletonTransactionList
  ) : (
    <TransactionList transactions={transactions} />
  );

  const isTransactionListExist = isAddressIds ? (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20231101 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20231101 - Julian) Search Bar */}
        <div className="flex w-full items-center justify-center lg:w-7/10">
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_TRANSACTIONS'),
            setSearch: setSearch,
          })}
        </div>
        <div className="flex w-full flex-col items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Info: (20231101 - Julian) Date Picker */}
          <div className="flex w-full items-center text-base lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker period={period} setFilteredPeriod={setPeriod} />
          </div>

          {/* Info: (20230904 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
              bgColor="bg-darkPurple"
            />
          </div>
        </div>
      </div>
      {/* Info: (20230907 - Julian) Transaction List */}
      <div className="flex w-full flex-col items-center">
        {isShoeTransactionList}
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  ) : (
    <h2 className="text-2xl font-bold">{t('ERROR_PAGE.HEAD_TITLE')}</h2>
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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-28 lg:px-40">
            <div className="flex w-full items-center justify-start py-10">
              {/* Info: (20231114 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                {/* Info: (20231114 -Julian) Transaction List Title */}
                {mainTitle}
                {/* Info: (20231114 -Julian) Sub Title */}
                {subTitle}
              </div>
            </div>

            {/* Info: (20231114 - Julian) Transaction List */}
            {isTransactionListExist}

            <div className="pt-10">
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
      params: {chainId: 'isun', blockId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }

  const chainId = params.chainId;

  return {
    props: {chainId, ...(await serverSideTranslations(locale as string, ['common']))},
  };
};

export default TransactionsPage;
