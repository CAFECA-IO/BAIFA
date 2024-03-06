import {useState, useEffect, useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import Footer from '../footer/footer';
import Breadcrumb from '../breadcrumb/breadcrumb';
import CurrencyItem from '../currency_item/currency_item';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {ICurrency} from '../../interfaces/currency';
import Pagination from '../pagination/pagination';
import {ITEM_PER_PAGE} from '../../constants/config';
import SearchBar from '../search_bar/search_bar';
import useStateRef from 'react-usestateref';
import SortingMenu from '../sorting_menu/sorting_menu';

const AllCurrenciesPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {getCurrencies} = useContext(MarketContext);

  const [currenciesData, setCurrenciesData] = useState<ICurrency[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setCurrenciesData(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('getCurrencies error', error);
      }
    };

    fetchCurrencies();
  }, [getCurrencies]);

  // Info: (20240226) 貨幣種類選項
  const currencyTypes = currenciesData.map(currency => currency.currencyName);
  const typeOptions = ['SORTING.ALL', ...currencyTypes];

  const sortingOptions = ['A to Z', 'Z to A']; // Info: (20240125 - Julian) 暫時以字母排序

  const [search, setSearch, searchRef] = useStateRef('');

  const [filteredType, setFilteredType] = useState(typeOptions[0]);
  const [sorting, setSorting] = useState(sortingOptions[0]);

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

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(currenciesData.length / ITEM_PER_PAGE));

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    setActivePage(1);
    setTotalPages(Math.ceil(currenciesData.length / ITEM_PER_PAGE));
  }, [currenciesData]);

  const searchResult = currenciesData
    .filter(currency => {
      const currencyId = currency.currencyId.toString().toLowerCase();
      const currencyNameLc = currency.currencyName.toLowerCase();
      const searchTerm = searchRef.current.toLowerCase();
      const currencyName = currency.currencyName;

      // Info: (20240226) 根據搜尋條件篩選
      const matchesSearchTerm =
        searchTerm === '' || currencyId.includes(searchTerm) || currencyNameLc.includes(searchTerm);

      // Info: (20240226) 根據貨幣種類的選擇做篩選
      const isAllCurrencies = filteredType === typeOptions[0];
      const matchesCurrency = isAllCurrencies || currencyName === filteredType;

      return matchesSearchTerm && matchesCurrency;
    })
    .sort((a, b) => {
      // Info: (20240226) 按照字母排序
      return sorting === sortingOptions[0]
        ? a.currencyName.localeCompare(b.currencyName)
        : b.currencyName.localeCompare(a.currencyName);
    });

  const displayCurrenciesList = searchResult
    .map((currency, index) => (
      <CurrencyItem
        key={index}
        currencyId={currency.currencyId}
        currencyName={currency.currencyName}
        rank={index + 1} // Info: (20240126 - Julian) DB 並沒有 rank，所以暫時用 index + 1 代替
        riskLevel={currency.riskLevel}
      />
    ))
    .slice(startIdx, endIdx); // Info: (20240226) 依照分頁切段

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
            <SearchBar
              searchBarPlaceholder={t('CURRENCIES_PAGE.SEARCH_PLACEHOLDER')}
              setSearch={setSearch}
            />
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
