import Head from 'next/head';
import {useState} from 'react';
import useStateRef from 'react-usestateref';
import NavBar from '../../components/nav_bar/nav_bar';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import DatePicker from '../../components/date_picker/date_picker';
import Pagination from '../../components/pagination/pagination';
import SearchBar from '../../components/search_bar/search_bar';
import BlacklistItem from '../../components/blacklist_item/blacklist_item';
import {dummyBlacklistAddressData, IAddress} from '../../interfaces/address';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {sortOldAndNewOptions} from '../../constants/config';

const BlackListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20231113 - Julian) Page State
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // Info: (20231113 - Julian) Filter State
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  // Info: (20231113 - Julian) Blacklist State
  const [filteredBlacklist, setFilteredBlacklist] = useState<IAddress[]>(dummyBlacklistAddressData);

  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('BLACKLIST_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.BLACKLIST,
    },
  ];

  const displayBlacklist = filteredBlacklist.slice(0, 10).map((address, index) => {
    return <BlacklistItem key={index} address={address} />;
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{t('BLACKLIST_PAGE.BREADCRUMB_TITLE')} - BAIFA</title>
      </Head>

      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden">
          <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
            {/* Info: (20231113 -Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>

            {/* Info: (20231113 -Julian) Black List Title */}
            <div className="flex justify-center p-10">
              <h1 className="text-2xl font-bold lg:text-48px">
                <span className="text-lightRed">{t('BLACKLIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
                {t('BLACKLIST_PAGE.MAIN_TITLE')}
              </h1>
            </div>

            {/* Info: (20231113 - Julian) Black List */}
            <div className="w-full">
              {/* Info: (20231113 - Julian) Search Filter */}
              <div className="flex w-full flex-col items-end space-y-10">
                {/* Info: (20231113 - Julian) Search Bar */}
                <div className="mx-auto my-5 w-full lg:w-7/10">
                  <SearchBar
                    searchBarPlaceholder={t('RED_FLAG_DETAIL_PAGE.SEARCH_PLACEHOLDER')}
                    setSearch={setSearch}
                  />
                </div>
                <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:justify-between">
                  {/* Info: (20231113 - Julian) Type Select Menu */}
                  <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
                    {/* <SortingMenu
                      sortingOptions={typeOptions}
                      sorting={filteredType}
                      setSorting={setFilteredType}
                      bgColor="bg-darkPurple"
                    /> */}
                  </div>
                  {/* Info: (20231113 - Julian) Date Picker */}
                  <div className="flex w-full items-center text-sm lg:w-fit lg:space-x-2">
                    <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
                    <DatePicker setFilteredPeriod={setPeriod} />
                  </div>
                  {/* Info: (20231113 - Julian) Sorting Menu */}
                  <div className="relative flex w-full items-center text-sm lg:w-fit lg:space-x-2">
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

              {/* Info: (20231113 - Julian) Blcak List */}
              <div className="mt-10 flex w-full flex-col items-center space-y-10">
                <div className="flex w-full flex-col">{displayBlacklist}</div>
                <Pagination
                  activePage={activePage}
                  setActivePage={setActivePage}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default BlackListPage;
