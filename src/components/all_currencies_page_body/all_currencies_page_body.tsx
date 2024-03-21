import {useState, useEffect} from 'react';
//import {MarketContext} from '../../contexts/market_context';
import Footer from '../footer/footer';
import Breadcrumb from '../breadcrumb/breadcrumb';
import CurrencyItem from '../currency_item/currency_item';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {ICurrencyListPage} from '../../interfaces/currency';
import Pagination from '../pagination/pagination';
import {SearchBarWithKeyDown} from '../search_bar/search_bar';
import SortingMenu from '../sorting_menu/sorting_menu';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../constants/api_request';
import Skeleton from '../skeleton/skeleton';
import {ITEM_PER_PAGE} from '../../constants/config';
import {getKeyByValue} from '../../lib/common';

const AllCurrenciesPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  //const {getCurrencies} = useContext(MarketContext);

  const sortingOptions = ['A to Z', 'Z to A']; // Info: (20240125 - Julian) 暫時以字母排序
  const typeOptionDefault = 'SORTING.ALL';

  const [filteredType, setFilteredType] = useState(typeOptionDefault);
  // Info: (20240308 - Liz) 搜尋條件
  const [search, setSearch] = useState('');
  // Info: (20240308 - Liz) 如果是選擇 A ot Z, API req 參數 sort=asc, 如果是選擇 Z to A, API 參數 sort=desc
  const [sorting, setSorting] = useState(sortingOptions[0]);
  // Info: (20240308 - Liz) UI
  //const [currenciesData, setCurrenciesData] = useState<ICurrencyListPage>();
  const [activePage, setActivePage] = useState<number>(1);

  const [filteredTypeByChainId, setFilteredTypeByChainId] = useState('');

  const sortingMap = {
    [sortingOptions[0]]: 'asc',
    [sortingOptions[1]]: 'desc',
  };
  const sortingReq = sortingMap[sorting];

  const {data: currenciesData, isLoading} = useAPIResponse<ICurrencyListPage>(
    `${APIURL.CURRENCIES}`,
    {method: HttpMethod.GET},
    {
      page: activePage,
      sort: sortingReq,
      search: search,
      type: filteredTypeByChainId,
    }
  );

  // Info: (20240319 - Liz) chain id 和 chain name 的對應物件
  useEffect(() => {
    const chainIdNameObj = currenciesData?.chainIdNameObj ?? {'': ''};

    const filteredChainId = getKeyByValue(chainIdNameObj, filteredType) ?? '';
    setFilteredTypeByChainId(filteredChainId);
  }, [filteredType, currenciesData]);

  // Info: (20240308 - Liz) 從 API 取得總頁數
  const totalPages = currenciesData?.totalPages ?? 0;

  // Info: (20240308 - Liz) API 查詢參數
  //const [apiQueryStr, setApiQueryStr] = useState(`page=1&sort=asc&search=&type=`);

  // Info: (20240308 - Liz) 下拉式選單選項(chain id)由 API 回傳
  const chainNameTypes = currenciesData?.chainNameTypes ?? [];
  const typeOptions = [typeOptionDefault, ...chainNameTypes];

  // Info: (20240308 - Liz) 當搜尋、篩選、排序的條件改變時，將 activePage 設為 1。
  /*   useEffect(() => {
    setActivePage(1);
  }, [search, filteredType, sorting]);

  // Info: (20240308 - Liz) Call API to get currencies data
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies(apiQueryStr);
        setCurrenciesData(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('getCurrencies error', error);
      }
    };

    fetchCurrencies();
    // Info: (20240308 - Liz) 當 API 查詢參數改變時，重新取得資料
  }, [apiQueryStr, getCurrencies]); */

  // Info: (20240305 - Liz) 設定 API 查詢參數
  /*   useEffect(() => {
    const pageQuery = `page=${activePage}`;
    const sortQuery = `&sort=${sortingReq}`;
    const searchQuery = `&search=${search}`;

    const typeQuery =
      filteredType === typeOptionDefault ? `&type=${''}` : `&type=${filteredTypeByChainId}`;

    setApiQueryStr(`${pageQuery}${sortQuery}${searchQuery}${typeQuery}`);
  }, [activePage, filteredType, filteredTypeByChainId, search, sortingReq]); */

  // Info: (20240308 - Liz) 顯示貨幣列表
  const currenciesList =
    currenciesData?.currencies && currenciesData.currencies.length > 0 ? (
      currenciesData?.currencies?.map((currency, index) => (
        <CurrencyItem
          key={index}
          currencyId={currency.currencyId}
          currencyName={currency.currencyName}
          rank={index + 1} // Info: (20240126 - Julian) DB 並沒有 rank，所以暫時用 index + 1 代替
          riskLevel={currency.riskLevel}
        />
      ))
    ) : (
      <h2 className="text-center">{t('COMMON.NO_DATA')}</h2>
    );

  const skeletonCurrenciesList = (
    <div className="flex h-680px w-full flex-col">
      {Array.from({length: ITEM_PER_PAGE}).map((_, index) => (
        <div
          key={index}
          className="flex h-60px w-full items-center gap-4 border-b border-darkPurple4 px-4"
        >
          <Skeleton width={30} height={30} />
          <Skeleton width={30} height={30} rounded />
          <Skeleton width={100} height={20} />
          <div className="ml-auto">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      ))}
    </div>
  );

  const displayCurrenciesList = isLoading ? skeletonCurrenciesList : currenciesList;

  // Info: (20240308 - Liz) Breadcrumb
  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('CURRENCIES_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.CURRENCIES,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
        <div className="">
          <Breadcrumb crumbs={crumbs} />
        </div>
        <div className="flex justify-center p-10">
          <h1 className="text-2xl font-bold lg:text-48px">
            <span className="text-primaryBlue">{t('CURRENCIES_PAGE.TITLE_HIGHLIGHT')} </span>
            {t('CURRENCIES_PAGE.TITLE')}
          </h1>
        </div>

        {/* Info: (20231101 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-center space-y-10 lg:px-20">
          {/* Info: (20231101 - Julian) Search Bar */}
          <div className="flex lg:w-7/10">
            {SearchBarWithKeyDown({
              searchBarPlaceholder: t('CURRENCIES_PAGE.SEARCH_PLACEHOLDER'),
              setSearch: setSearch,
            })}
          </div>
          <div className="flex w-full flex-col items-center justify-between lg:flex-row">
            <div className="w-full lg:w-fit">
              <SortingMenu
                sortingOptions={typeOptions}
                sorting={filteredType}
                setSorting={setFilteredType}
                bgColor="bg-darkPurple"
              />
            </div>

            <div className="my-2 flex w-full items-center text-base lg:my-0 lg:w-fit lg:space-x-2">
              <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
              <SortingMenu
                sortingOptions={sortingOptions}
                sorting={sorting}
                setSorting={setSorting}
                bgColor="bg-darkPurple"
              />
            </div>
          </div>
        </div>

        {/* Info: (20230927 - Julian) Currency list */}
        <div className="flex flex-col py-10 lg:px-20">{displayCurrenciesList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AllCurrenciesPageBody;
