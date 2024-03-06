import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {convertStringToSortingType, getChainIcon, truncateText} from '../../../../../../lib/common';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {IRedFlag, IRedFlagOfAddress} from '../../../../../../interfaces/red_flag';
import RedFlagList from '../../../../../../components/red_flag_list/red_flag_list';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_PAGE,
  DEFAULT_RED_FLAG_COUNT_IN_PAGE,
  DEFAULT_TRUNCATE_LENGTH,
  ITEM_PER_PAGE,
  default30DayPeriod,
  sortOldAndNewOptions,
} from '../../../../../../constants/config';
import Skeleton from '../../../../../../components/skeleton/skeleton';
import useAPIResponse from '../../../../../../lib/hooks/use_api_response';
import {APIURL} from '../../../../../../constants/api_request';
import {IDatePeriod} from '../../../../../../interfaces/date_period';

interface IRedFlagOfAddressPageProps {
  chainId: string;
  addressId: string;
}

const RedFlagOfAddressPage = ({chainId, addressId}: IRedFlagOfAddressPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();
  const {page} = router.query;

  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} ${t('COMMON.OF')} ${t(
    'ADDRESS_DETAIL_PAGE.MAIN_TITLE'
  )} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(chainId);

  const [search, setSearch] = useState<string>('');
  const [period, setPeriod] = useState<IDatePeriod>(default30DayPeriod);
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [activePage, setActivePage] = useState<number>(page ? +page : DEFAULT_PAGE);
  const [filteredType, setFilteredType] = useState<string>('SORTING.ALL');

  const {data, isLoading, error} = useAPIResponse<IRedFlagOfAddress>(
    `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/red_flags`,
    {
      search: search,
      start_date: period.startTimeStamp === 0 ? '' : period.startTimeStamp,
      end_date: period.endTimeStamp === 0 ? '' : period.endTimeStamp,
      order: convertStringToSortingType(sorting),
      page: activePage,
      offset: ITEM_PER_PAGE,
      type: filteredType === 'SORTING.ALL' ? '' : filteredType,
    }
  );

  const typeOptions = ['SORTING.ALL', ...(data?.allRedFlagTypes ?? [])];

  const backClickHandler = () => router.back();

  const displayedRedFlagList = (
    <RedFlagList
      redFlagData={data?.redFlagData ?? []}
      period={period}
      setPeriod={setPeriod}
      sorting={sorting}
      setSorting={setSorting}
      activePage={activePage}
      setActivePage={setActivePage}
      totalPages={data?.totalPage ?? 0}
      setSearch={setSearch}
      isLoading={isLoading}
      filteredType={filteredType}
      setFilteredType={setFilteredType}
      typeOptions={typeOptions}
    />
  );

  const displayedAddress = (
    <div className="flex w-full flex-1 items-center justify-center space-x-2 whitespace-nowrap">
      {!isLoading ? (
        <div className="flex w-200px grow items-center justify-center space-x-2 text-xl">
          <Image
            src={chainIcon.src}
            alt={chainIcon.alt}
            width={30}
            height={30}
            onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
          />
          <p title={addressId} className="overflow-hidden text-ellipsis">
            {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId}
          </p>{' '}
        </div>
      ) : (
        <Skeleton width={250} height={30} />
      )}
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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231109 - Julian) Header */}
            <div className="flex w-full items-start justify-start">
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

                {displayedAddress}
              </div>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="w-full">{displayedRedFlagList}</div>

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

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const {chainId = '', addressId = ''} = query;
  return {
    props: {
      chainId,
      addressId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
