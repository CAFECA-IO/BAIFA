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
  const {currencyList} = useContext(MarketContext);

  const currenciesOptions = ['SORTING.ALL', 'Ethereum', 'Bitcoin', 'iSunCloud', 'BNB', 'Tether'];
  const sortingOptions = ['SORTING.POPULAR', 'SORTING.UNPOPULAR'];

  const [search, setSearch, searchRef] = useStateRef('');
  const [currencies, setCurrencies] = useState(currenciesOptions[0]);
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
  const [totalPages, setTotalPages] = useState(Math.ceil(currencyList.length / ITEM_PER_PAGE));
  const [filteredCurrencyData, setFilteredCurrencyData] = useState<ICurrency[]>(currencyList);

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    const searchResult = currencyList
      .filter(currency => {
        // Info: (20231101 - Julian) filter by search term
        const searchTerm = searchRef.current.toLowerCase();
        const currencyId = currency.currencyId.toString().toLowerCase();
        const currencyName = currency.currencyName.toLowerCase();
        return searchTerm !== ''
          ? currencyId.includes(searchTerm) || currencyName.includes(searchTerm)
          : true;
      })
      .filter(currency => {
        // Info: (20231101 - Julian) filter by currency
        const currencyId = currency.currencyId;
        const currencyName = currency.currencyName;
        return currencies !== currenciesOptions[0]
          ? currencyName === currencies || currencyId === currencies
          : true;
      })
      .sort((a, b) => {
        // Info: (20231101 - Julian) sort by popularity
        return sorting === sortingOptions[0] ? a.rank - b.rank : b.rank - a.rank;
      });

    setFilteredCurrencyData(searchResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, currencies, sorting]);

  useEffect(() => {
    setActivePage(1);
    setTotalPages(Math.ceil(currencyList.length / ITEM_PER_PAGE));
  }, [currencyList]);

  const currenciesList = filteredCurrencyData
    .map((currency, index) => (
      <CurrencyItem
        key={index}
        currencyId={currency.currencyId}
        currencyName={currency.currencyName}
        rank={currency.rank}
        riskLevel={currency.riskLevel}
      />
    ))
    .slice(startIdx, endIdx);

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
                sortingOptions={currenciesOptions}
                sorting={currencies}
                setSorting={setCurrencies}
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
        <div className="flex flex-col py-10 lg:px-20">{currenciesList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AllCurrenciesPageBody;
