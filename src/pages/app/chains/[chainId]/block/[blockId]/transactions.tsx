import Head from 'next/head';
import Image from 'next/image';
import {useEffect, useState, useContext} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import Footer from '../../../../../../components/footer/footer';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import {BsArrowLeftShort} from 'react-icons/bs';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {GetStaticPaths, GetStaticProps} from 'next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {getChainIcon} from '../../../../../../lib/common';
import {IDisplayTransaction} from '../../../../../../interfaces/transaction';
import DatePicker from '../../../../../../components/date_picker/date_picker';
import Pagination from '../../../../../../components/pagination/pagination';
import SearchBar from '../../../../../../components/search_bar/search_bar';
import SortingMenu from '../../../../../../components/sorting_menu/sorting_menu';
import TransactionList from '../../../../../../components/transaction_list/transaction_list';
import {
  DEFAULT_CHAIN_ICON,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../../../constants/config';
import Skeleton from '../../../../../../components/skeleton/skeleton';

interface ITransitionsInBlockPageProps {
  chainId: string;
  blockId: string;
}

const TransitionsInBlockPage = ({chainId, blockId}: ITransitionsInBlockPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getTransactionListOfBlock} = useContext(MarketContext);
  const router = useRouter();
  // Info: (20240220 - Julian) 搜尋條件
  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  // Info: (20240220 - Julian) API 查詢參數
  const [apiQueryStr, setApiQueryStr] = useState('');
  // Info: (20240220 - Julian) UI
  const [transactionData, setTransitionData] = useState<IDisplayTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Info: (20240215 - Julian) 計算總頁數
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(transactionData.length / ITEM_PER_PAGE)
  );
  const [activePage, setActivePage] = useState(1);

  const headTitle = `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_BLOCK')} ${blockId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  const getTransactionData = async () => {
    // Info: (20240220 - Julian) Loading 畫面
    setIsLoading(true);

    try {
      const data = await getTransactionListOfBlock(chainId, blockId, apiQueryStr);
      setTransitionData(data);
      // Info: (20240215 - Julian) 每次取得資料後，重新計算總頁數
      setTotalPages(Math.ceil(data.length / ITEM_PER_PAGE));
    } catch (error) {
      //console.log('getTransactionListOfBlock error', error);
    }
    // Info: (20240220 - Julian) 如果拿到資料，就將 isLoading 設為 false
    setIsLoading(false);
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Info: (20240219 - Julian) 如果 3 秒後還沒拿到資料，也將 isLoading 設為 false
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionData]);

  useEffect(() => {
    // Info: (20240220 - Julian) 當日期或 blockId 改變時，重設 activePage
    setActivePage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, blockId]);

  useEffect(() => {
    // Info: (20240220 - Julian) 當 activePage 改變時，重新取得資料
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  useEffect(() => {
    // Info: (20240220 - Julian) 設定 API 查詢參數
    // ToDo: (20240220 - Julian) date query string
    const pageQuery = `page=${activePage}`;
    // Info: (20240220 - Julian) 當搜尋條件改變時，重新取得資料
    setApiQueryStr(`${pageQuery}`);
  }, [activePage, period]);

  const displayTransactionList = isLoading ? (
    // Info: (20240206 - Julian) Loading animation
    <div className="flex w-full flex-col py-10 divide-y divide-darkPurple4 h-680px">
      {Array.from({length: 10}).map((_, index) => (
        <div
          key={index}
          className="flex w-full items-center gap-8 h-60px border-darkPurple4 border-b px-1"
        >
          <Skeleton width={50} height={50} />
          <Skeleton width={150} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-col items-center">
      <TransactionList transactions={transactionData} />
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </div>
  );

  const displayedTransactions = (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20240125 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20240125 - Julian) Search Bar */}
        <div className="flex w-full items-center justify-center lg:w-7/10">
          <SearchBar
            searchBarPlaceholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_TRANSACTIONS')}
            setSearch={setSearch}
          />
        </div>
        <div className="flex w-full flex-col items-center space-y-2 pt-16 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Info: (20240125 - Julian) Date Picker */}
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
  if (!params || !params.blockId || typeof params.blockId !== 'string') {
    return {
      notFound: true,
    };
  }

  const chainId = params.chainId;
  const blockId = params.blockId;

  if (!chainId || !blockId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chainId,
      blockId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default TransitionsInBlockPage;
