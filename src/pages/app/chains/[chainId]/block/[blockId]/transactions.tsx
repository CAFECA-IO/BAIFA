import {useEffect, useState, useContext} from 'react';
import {BsArrowLeftShort} from 'react-icons/bs';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_PAGE,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '@/constants/config';
import {getDynamicUrl} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {ITransactionList} from '@/interfaces/transaction';
import {convertStringToSortingType, getChainIcon} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';
import {AppContext} from '@/contexts/app_context';
import NavBar from '@/components/nav_bar/nav_bar';
import Footer from '@/components/footer/footer';
import BoltButton from '@/components/bolt_button/bolt_button';
import DatePicker from '@/components/date_picker/date_picker';
import Pagination from '@/components/pagination/pagination';
import {SearchBarWithKeyDown} from '@/components/search_bar/search_bar';
import SortingMenu from '@/components/sorting_menu/sorting_menu';
import TransactionList from '@/components/transaction_list/transaction_list';
import Skeleton from '@/components/skeleton/skeleton';

interface ITransitionsInBlockPageProps {
  chainId: string;
  blockId: string;
}

const TransitionsInBlockPage = ({chainId, blockId}: ITransitionsInBlockPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);

  const router = useRouter();
  const {page} = router.query;

  // Info: (20240220 - Julian) 搜尋條件
  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  const [activePage, setActivePage] = useState<number>(page ? +page : DEFAULT_PAGE);

  // Info: (20240410 - Liz) Call API to get transaction data (API-008)
  const {data: transactionListData, isLoading: isTransactionListLoading} =
    useAPIResponse<ITransactionList>(
      `${APIURL.CHAINS}/${chainId}/block/${blockId}/transactions`,
      {method: HttpMethod.GET},
      // Info: (20240410 - Liz) 預設值 ?page=1&offset=10&sort=desc&search=&start_date=&end_date=
      {
        page: activePage,
        offset: ITEM_PER_PAGE,
        sort: convertStringToSortingType(sorting),
        search: search,
        start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
        end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
      }
    );

  const headTitle = `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_BLOCK')} ${blockId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.push(`${getDynamicUrl(chainId, blockId).BLOCK}`);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20240206 - Julian) Loading animation
  const skeletonTransactionList = (
    <div className="flex h-680px w-full flex-col divide-y divide-darkPurple4 py-10">
      {Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <div
          key={index}
          className="flex h-60px w-full items-center gap-8 border-b border-darkPurple4 px-1"
        >
          <Skeleton width={50} height={50} />
          <Skeleton width={150} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  );

  // const transactionList = transactionListData ?? {transactions: [], totalPages: 0};
  // const {transactions, totalPages} = transactionList;

  const displayTransactionList = isTransactionListLoading ? (
    skeletonTransactionList
  ) : (
    <div className="flex w-full flex-col items-center">
      <TransactionList transactions={transactionListData?.transactions ?? []} />
      <Pagination
        activePage={activePage}
        setActivePage={setActivePage}
        totalPages={transactionListData?.totalPages ?? 0}
      />
    </div>
  );

  const displayedTransactions = (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20240125 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20240125 - Julian) Search Bar */}
        <div className="flex w-full items-center justify-center lg:w-7/10">
          {SearchBarWithKeyDown({
            searchBarPlaceholder: t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_TRANSACTIONS'),
            setSearch,
            setActivePage: setActivePage,
          })}
        </div>
        <div className="flex w-full flex-col items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Info: (20240125 - Julian) Date Picker */}
          <div className="flex w-full items-center text-base lg:w-fit lg:space-x-2">
            <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
            <DatePicker
              period={period}
              setFilteredPeriod={setPeriod}
              setActivePage={setActivePage}
            />
          </div>

          {/* Info: (20230904 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
              bgColor="bg-darkPurple"
              setActivePage={setActivePage}
            />
          </div>
        </div>
      </div>
      {/* Info: (20230907 - Julian) Transaction List */}
      {displayTransactionList}
    </div>
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
              {/* Info: (20231211 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                {/* Info: (20231211 -Julian) Title */}
                <h1 className="text-2xl font-bold lg:text-48px">
                  <span className="text-primaryBlue">
                    {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}
                  </span>
                  {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_BLOCK')}
                </h1>
                {/* Info: (20231211 -Julian) Sub Title */}
                <div className="flex items-center space-x-2">
                  <Image
                    src={chainIcon.src}
                    alt={chainIcon.alt}
                    width={30}
                    height={30}
                    onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
                  />
                  <h2 className="text-xl">
                    {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} {blockId}
                  </h2>
                </div>
              </div>
            </div>

            {/* Info: (20231211 - Julian) Transaction List */}
            {displayedTransactions}

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

export const getServerSideProps: GetServerSideProps = async ({params, locale}) => {
  if (
    !params ||
    !params.chainId ||
    typeof params.chainId !== 'string' ||
    !params.blockId ||
    typeof params.blockId !== 'string'
  ) {
    return {
      notFound: true,
    };
  }

  const {chainId, blockId} = params;

  return {
    props: {
      chainId,
      blockId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default TransitionsInBlockPage;
