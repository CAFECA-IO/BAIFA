import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../../../contexts/app_context';
import {MarketContext} from '../../../../contexts/market_context';
import {useRouter} from 'next/router';
import NavBar from '../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import Footer from '../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ITransaction} from '../../../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../interfaces/locale';
import {getChainIcon} from '../../../../lib/common';
import {GetStaticPaths, GetStaticProps} from 'next';
import useStateRef from 'react-usestateref';
import TransactionList from '../../../../components/transaction_list/transaction_list';
import SearchBar from '../../../../components/search_bar/search_bar';
import DatePicker from '../../../../components/date_picker/date_picker';
import SortingMenu from '../../../../components/sorting_menu/sorting_menu';
import Pagination from '../../../../components/pagination/pagination';
import {default30DayPeriod, sortOldAndNewOptions} from '../../../../constants/config';

interface ITransactionsPageProps {
  chainId: string;
}

const TransactionsPage = ({chainId}: ITransactionsPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {addressId} = router.query;

  const appCtx = useContext(AppContext);
  const {getInteractionTransaction} = useContext(MarketContext);

  const totalPages = 100; // ToDo: (20240129 - Julian) 如何從 API 取得總頁數？
  const [activePage, setActivePage] = useState(1);

  const [period, setPeriod] = useState(default30DayPeriod);
  const [search, setSearch, searchRef] = useStateRef('');
  const [transactionData, setTransactionData] = useState<ITransaction[]>([]);

  // Info: (20240119 - Julian) 設定 API 查詢參數
  const dateQuery =
    period.startTimeStamp === 0 || period.endTimeStamp === 0
      ? ''
      : `&start_date=${period.startTimeStamp}&end_date=${period.endTimeStamp}`;
  const pageQuery = `page=${activePage}`;

  const apiQueryStr = `${pageQuery}${dateQuery}`;

  // Info: (20240129 - Julian) call API 並將資料存入 transactionData
  const getTransactionData = async () => {
    try {
      // Info: (20240129 - Julian) 如果有取得 addressId，則轉換成 query string
      const addressA = typeof addressId === 'object' ? `addressId=${addressId[0]}` : undefined;
      const addressB = typeof addressId === 'object' ? `&addressId=${addressId[1]}` : undefined;
      const data = await getInteractionTransaction(chainId, addressA, addressB, apiQueryStr);
      setTransactionData(data);
    } catch (error) {
      //console.log('getInteractionTransaction error', error);
    }
  };

  //  Info: (20231114 - Julian) 如果有取得 addressId，且 addressId 是陣列，則顯示資料
  const isAddressIds = !!addressId && typeof addressId === 'object';

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    if (addressId) {
      getTransactionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressId]);

  useEffect(() => {
    setActivePage(1);
    getTransactionData();
  }, [period, chainId]);

  useEffect(() => {
    getTransactionData();
  }, [activePage]);

  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>(transactionData);

  useEffect(() => {
    const searchResult = transactionData
      // Info: (20230905 - Julian) filter by search term
      // .filter((transaction: ITransaction) => {
      //   const searchTerm = searchRef.current.toLowerCase();
      //   const transactionId = transaction.id.toString().toLowerCase();
      //   const status = transaction.status.toLowerCase();

      //   return searchTerm !== ''
      //     ? transactionId.includes(searchTerm) || status.includes(searchTerm)
      //     : true;
      // })
      .sort((a: ITransaction, b: ITransaction) => {
        return sorting === sortOldAndNewOptions[0]
          ? // Info: (20231101 - Julian) Newest
            b.createdTimestamp - a.createdTimestamp
          : // Info: (20231101 - Julian) Oldest
            a.createdTimestamp - b.createdTimestamp;
      });
    setFilteredTransactions(searchResult);
  }, [transactionData, search, sorting]);

  const headTitle = isAddressIds
    ? `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_ADDRESS_1')} ${addressId[0]} ${t(
        'TRANSACTION_LIST_PAGE.HEAD_TITLE_ADDRESS_2'
      )} ${addressId[1]} - BAIFA`
    : `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_ADDRESS_1')} - BAIFA`;

  const chainIcon = getChainIcon(chainId);
  const backClickHandler = () => router.back();

  const mainTitle = (
    <h1 className="text-2xl font-bold lg:text-48px">
      <span className="text-primaryBlue">{t('TRANSACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
      {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_ADDRESSES')}
    </h1>
  );

  const subTitle = isAddressIds ? (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
        <h2 className="text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId[0]}
        </h2>
      </div>
      <Image src="/icons/switch.svg" alt="" width={24} height={24} />
      <div className="flex items-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
        <h2 className="text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId[1]}
        </h2>
      </div>
    </div>
  ) : (
    <></>
  );

  const isShowTransactionList = transactionData ? (
    <div className="flex w-full flex-col items-center font-inter">
      {/* Info: (20231101 - Julian) Search Filter */}
      <div className="flex w-full flex-col items-center">
        {/* Info: (20231101 - Julian) Search Bar */}
        <div className="flex w-full items-center justify-center lg:w-7/10">
          <SearchBar
            searchBarPlaceholder={t('CHAIN_DETAIL_PAGE.SEARCH_PLACEHOLDER_TRANSACTIONS')}
            setSearch={setSearch}
          />
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
        <TransactionList transactions={filteredTransactions} />
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
            {isShowTransactionList}

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

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
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
