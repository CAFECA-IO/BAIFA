import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import SearchBar from '../../../../../../components/search_bar/search_bar';
import SortingMenu from '../../../../../../components/sorting_menu/sorting_menu';
import DatePicker from '../../../../../../components/date_picker/date_picker';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getChainIcon} from '../../../../../../lib/common';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {dummyAddressData} from '../../../../../../interfaces/address';
import {dummyContractData} from '../../../../../../interfaces/contract';
import {IInteractionItem} from '../../../../../../interfaces/interaction_item';
import {ITEM_PER_PAGE, sortOldAndNewOptions} from '../../../../../../constants/config';
import Pagination from '../../../../../../components/pagination/pagination';

interface IRedFlagOfAddressPageProps {
  chainId: string;
  addressId: string;
}

const RedFlagOfAddressPage = ({chainId, addressId}: IRedFlagOfAddressPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}${t(
    'RED_FLAG_DETAIL_PAGE.MAIN_TITLE'
  )} ${t('COMMON.OF')} ${t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const router = useRouter();
  const backClickHandler = () => router.back();

  // Info: (20231109 - Julian) Type Options
  const typeOptions = ['SORTING.ALL'];

  // Info: (20231109 - Julian) States
  const [search, setSearch, searchRef] = useStateRef('');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [period, setPeriod] = useState({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });
  const [filteredType, setFilteredType] = useState<string>(typeOptions[0]);
  //const [filteredInteractedList, setFilteredInteractedList] =
  //  useState<IInteractionItem[]>(interactedList);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  //  Math.ceil(interactedList.length / ITEM_PER_PAGE)

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    /*       const searchResult = interactedList
        // Info: (20231108 - Julian) filter by search term
        .filter((interactedData: IInteractionItem) => {
          const searchTerm = searchRef.current.toLowerCase();
          const type = interactedData.type.toLowerCase();
          const id = interactedData.id.toLowerCase();
          const publicTag = interactedData.publicTag.map(tag => tag.toLowerCase());
          return searchTerm !== ''
            ? type.includes(searchTerm) || id.includes(searchTerm) || publicTag.includes(searchTerm)
            : true;
        })
        // Info: (20231108 - Julian) filter by date range
        .filter((interactedData: IInteractionItem) => {
          const createdTimestamp = interactedData.createdTimestamp;
          const start = period.startTimeStamp;
          const end = period.endTimeStamp;
          // Info: (20231108 - Julian) if start and end are 0, it means that there is no period filter
          const isCreatedTimestampInRange =
            start === 0 && end === 0 ? true : createdTimestamp >= start && createdTimestamp <= end;
          return isCreatedTimestampInRange;
        })
        // Info: (20231108 - Julian) filter by type
        .filter((interactedData: IInteractionItem) => {
          const type = interactedData.type.toLowerCase();
          return filteredType !== typeOptions[0] ? filteredType.toLowerCase().includes(type) : true;
        })
        // Info: (20231108 - Julian) sort by Newest or Oldest
        .sort((a: IInteractionItem, b: IInteractionItem) => {
          return sorting === sortOldAndNewOptions[0]
            ? a.createdTimestamp - b.createdTimestamp
            : b.createdTimestamp - a.createdTimestamp;
        }); */

    //setFilteredInteractedList(searchResult);
    setActivePage(1);
    //setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
  }, [filteredType, search, period, sorting]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231109 - Julian) Header */}
            <div className="flex w-full items-center justify-start">
              {/* Info: (20231109 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231109 -Julian) Red Flag Title */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl font-bold lg:text-48px">
                  <span className="text-lightRed">
                    {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}
                  </span>
                  {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE')}
                </h1>
                <div className="flex items-center space-x-2">
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
                  <p className="text-xl">
                    {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId}
                  </p>
                </div>
              </div>
            </div>

            {/* Info: (20231109 - Julian) Search Filter */}
            <div className="flex w-full flex-col items-end space-y-10">
              {/* Info: (20231109 - Julian) Search Bar */}
              <div className="mx-auto w-full lg:w-7/10">
                <SearchBar
                  searchBarPlaceholder={t('RED_FLAG_DETAIL_PAGE.SEARCH_PLACEHOLDER')}
                  setSearch={setSearch}
                />
              </div>
              <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:justify-between">
                {/* Info: (20231109 - Julian) Type Select Menu */}
                <div className="relative flex w-full items-center space-y-2 text-base lg:w-fit">
                  <SortingMenu
                    sortingOptions={typeOptions}
                    sorting={filteredType}
                    setSorting={setFilteredType}
                  />
                </div>
                {/* Info: (20231109 - Julian) Date Picker */}
                <div className="flex w-full items-center text-sm lg:w-fit lg:space-x-2">
                  <p className="hidden text-lilac lg:block">{t('DATE_PICKER.DATE')} :</p>
                  <DatePicker setFilteredPeriod={setPeriod} />
                </div>
                {/* Info: (20231109 - Julian) Sorting Menu */}
                <div className="relative flex w-full items-center text-sm lg:w-fit lg:space-x-2">
                  <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
                  <SortingMenu
                    sortingOptions={sortOldAndNewOptions}
                    sorting={sorting}
                    setSorting={setSorting}
                  />
                </div>
              </div>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="flex w-full flex-col lg:mt-20"></div>
            <Pagination
              activePage={activePage}
              setActivePage={setActivePage}
              totalPages={totalPages}
            />

            {/* Info: (20231109 - Julian) Back button */}
            <div className="">
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

export default RedFlagOfAddressPage;

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyAddressData
    .flatMap(address => {
      return locales?.map(locale => ({
        params: {chainId: `${address.chainId}`, addressId: `${address.id}`},
        locale,
      }));
    })
    .filter(
      (path): path is {params: {chainId: string; addressId: string}; locale: string} => !!path
    );

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IRedFlagOfAddressPageProps> = async ({
  params,
  locale,
}) => {
  if (!params || !params.addressId || typeof params.addressId !== 'string') {
    return {
      notFound: true,
    };
  }
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }

  const originAddressData = dummyAddressData.find(address => `${address.id}` === params.addressId);

  if (!originAddressData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      addressId: params.addressId,
      chainId: params.chainId,
      //interactedList,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
