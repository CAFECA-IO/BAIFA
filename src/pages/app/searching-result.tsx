import Head from 'next/head';
import {useState} from 'react';
import useStateRef from 'react-usestateref';
import NavBar from '../../components/nav_bar/nav_bar';
import Footer from '../../components/footer/footer';
import SearchBar from '../../components/search_bar/search_bar';
import DatePicker from '../../components/date_picker/date_picker';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import Pagination from '../../components/pagination/pagination';
import {sortOldAndNewOptions} from '../../constants/config';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../../interfaces/locale';

const SearchingResultPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('SEARCHING_RESULT_PAGE.MAIN_TITLE')} - BAIFA`;
  const filterTabs = [
    'SEARCHING_RESULT_PAGE.ALL', // All
    'SEARCHING_RESULT_PAGE.BLOCKS', // Blocks
    'SEARCHING_RESULT_PAGE.ADDRESSES', // Addresses
    'SEARCHING_RESULT_PAGE.CONTRACTS', // Contracts
    'SEARCHING_RESULT_PAGE.EVIDENCES', // Evidences
    'SEARCHING_RESULT_PAGE.TRANSACTIONS', // Transactions
    'SEARCHING_RESULT_PAGE.BLACK_LIST', // Black List
    'SEARCHING_RESULT_PAGE.RED_FLAGS', // Red Flags
  ];
  const sortingOptions = ['SORTING.RELEVANCY', ...sortOldAndNewOptions];
  const shadowClassNameL =
    'before:absolute before:-inset-1 before:top-0 before:block xl:before:hidden before:w-5 before:bg-gradient-to-r before:from-black before:to-transparent';
  const shadowClassNameR =
    'after:absolute after:-inset-1 after:ml-auto after:top-0 after:block xl:after:hidden after:w-5 after:bg-gradient-to-l after:from-black after:to-transparent';

  // Info: (20231114 - Julian) Filter State
  const [search, setSearch, searchRef] = useStateRef<string>('');
  const [sorting, setSorting] = useState(sortingOptions[0]);
  const [activeTab, setActiveTab] = useState(filterTabs[0]);
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  // Info: (20231114 - Julian) Pagination State
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const displayedFilterTabs = filterTabs.map((tab, index) => {
    const tabClickHandler = () => setActiveTab(tab);
    const tabClassName = `whitespace-nowrap px-4 py-3 text-base border-b-3px ${
      activeTab === tab
        ? 'text-primaryBlue border-primaryBlue'
        : 'text-hoverWhite border-darkPurple4'
    } hover:text-primaryBlue cursor-pointer transition-all duration-150 ease-in-out`;

    return (
      <li key={index} className={tabClassName} onClick={tabClickHandler}>
        {t(tab)}
      </li>
    );
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      {/* Info:(20231114 - Julian) Navbar */}
      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col space-y-14 px-5 pt-32 lg:space-y-0 lg:px-40 lg:pt-48">
            {/* Info: (20231114 - Julian) Filter */}
            <div className="flex w-full flex-col items-center space-y-14 lg:space-y-10">
              {/* Info: (20231114 - Julian) Search Bar */}
              <div className="w-full lg:w-9/10">
                <SearchBar searchBarPlaceholder="What do you want to know?" setSearch={setSearch} />
              </div>
              {/* Info: (20231114 - Julian) Filter Tabs */}
              <div className="relative w-full overflow-hidden">
                {/* Info: (20231114 - Julian) Shadow */}
                <div
                  className={`absolute flex h-full w-full ${shadowClassNameL} ${shadowClassNameR}`}
                ></div>
                <ul className="relative flex w-full items-center justify-between space-x-4 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden">
                  {displayedFilterTabs}
                </ul>
              </div>
              <div className="flex w-full items-center justify-between">
                {/* Info: (20231101 - Julian) Date Picker */}
                <div className="flex w-full items-center space-x-2 text-base lg:w-fit">
                  <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
                  <DatePicker setFilteredPeriod={setPeriod} />
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
            {/* Info: (20231114 - Julian) Search Result List */}
            <div></div>

            <div className="mx-auto w-full">
              <Pagination
                activePage={activePage}
                setActivePage={setActivePage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Info:(20231114 - Julian) Footer */}
      <Footer />
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default SearchingResultPage;
