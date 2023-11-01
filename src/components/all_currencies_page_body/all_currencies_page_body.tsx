import {useState, useEffect} from 'react';
import Footer from '../footer/footer';
import Breadcrumb from '../breadcrumb/breadcrumb';
import CurrencyItem from '../currency_item/currency_item';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {ICurrency, dummyCurrencyData} from '../../interfaces/currency';
import Pagination from '../pagination/pagination';
import {ITEM_PER_PAGE} from '../../constants/config';
import SearchBar from '../search_bar/search_bar';
import useStateRef from 'react-usestateref';

const AllCurrenciesPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

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

  const [search, setSearch, searchRef] = useStateRef('');
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(dummyCurrencyData.length / ITEM_PER_PAGE));
  const [filteredCurrencyData, setFilteredCurrencyData] = useState<ICurrency[]>(dummyCurrencyData);

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    const searchResult = dummyCurrencyData.filter(currency => {
      // Info: (20231101 - Julian) filter by search term
      const searchTerm = searchRef.current.toLowerCase();
      const currencyId = currency.currencyId.toString().toLowerCase();
      const currencyName = currency.currencyName.toLowerCase();
      return searchTerm !== ''
        ? currencyId.includes(searchTerm) || currencyName.includes(searchTerm)
        : true;
    });
    // .sort((a: ICurrency, b: ICurrency) => {
    //   return sorting === 'Newest'
    //     ? b.createdTimestamp - a.createdTimestamp
    //     : a.createdTimestamp - b.createdTimestamp;
    // });
    setFilteredCurrencyData(searchResult);
  }, [search]);

  useEffect(() => {
    setActivePage(1);
    setTotalPages(Math.ceil(dummyCurrencyData.length / ITEM_PER_PAGE));
  }, [dummyCurrencyData]);

  const currenciesList = filteredCurrencyData
    .map((currency, index) => (
      <CurrencyItem
        key={index}
        currencyId={currency.currencyId}
        currencyName={currency.currencyName}
        rank={index + 1}
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
        <div className="flex w-full flex-col items-center">
          {/* Info: (20231101 - Julian) Search Bar */}
          <div className="relative flex w-full items-center justify-center drop-shadow-xl lg:w-7/10">
            <SearchBar searchBarPlaceholder={'Search in Currency list'} setSearch={setSearch} />
          </div>
        </div>

        {/* Info: (20230927 - Julian) Currency list */}
        <div className="flex flex-col px-20 py-5">{currenciesList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AllCurrenciesPageBody;
