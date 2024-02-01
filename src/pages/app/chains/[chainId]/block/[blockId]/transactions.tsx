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
import {ITransaction} from '../../../../../../interfaces/transaction';
import DatePicker from '../../../../../../components/date_picker/date_picker';
import Pagination from '../../../../../../components/pagination/pagination';
import SearchBar from '../../../../../../components/search_bar/search_bar';
import SortingMenu from '../../../../../../components/sorting_menu/sorting_menu';
import TransactionList from '../../../../../../components/transaction_list/transaction_list';
import {default30DayPeriod, sortOldAndNewOptions} from '../../../../../../constants/config';

interface ITransitionsInBlockPageProps {
  chainId: string;
  blockId: string;
}

const TransitionsInBlockPage = ({chainId, blockId}: ITransitionsInBlockPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getTransactionList} = useContext(MarketContext);
  const router = useRouter();

  const totalPages = 100; // ToDo: (20240119 - Julian) 如何從 API 取得總頁數？
  const [activePage, setActivePage] = useState(1);

  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch] = useState('');
  const [transactionData, setTransitionData] = useState<ITransaction[]>([]);

  const headTitle = `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_BLOCK')} ${blockId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  // Info: (20240119 - Julian) 設定 API 查詢參數
  const dateQuery =
    period.startTimeStamp === 0 || period.endTimeStamp === 0
      ? ''
      : `&start_date=${period.startTimeStamp}&end_date=${period.endTimeStamp}`;
  const pageQuery = `page=${activePage}`;
  const apiQueryStr = `${pageQuery}${dateQuery}`;

  const backClickHandler = () => router.back();
  const getTransactionData = async () => {
    try {
      const data = await getTransactionList(chainId, blockId, apiQueryStr);
      setTransitionData(data);
    } catch (error) {
      //console.log('getTransactionList error', error);
    }
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActivePage(1);
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, chainId]);

  useEffect(() => {
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>(transactionData);

  useEffect(() => {
    const searchResult = transactionData.sort((a: ITransaction, b: ITransaction) => {
      return sorting === sortOldAndNewOptions[0]
        ? // Info: (20231101 - Julian) Newest
          b.createdTimestamp - a.createdTimestamp
        : // Info: (20231101 - Julian) Oldest
          a.createdTimestamp - b.createdTimestamp;
    });
    setFilteredTransactions(searchResult);
  }, [transactionData, search, sorting]);

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
      <div className="flex w-full flex-col items-center">
        <TransactionList transactions={filteredTransactions} />
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
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
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
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
