import Footer from '../footer/footer';
import ChainsCard from '../chain_card/chain_card';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import Skeleton from '../skeleton/skeleton';
import {IChainDetail} from '../../interfaces/chain';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {APIURL, HttpMethod} from '../../constants/api_request';

const AllChainPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {data: chainData, isLoading: isChainLoading} = useAPIResponse<IChainDetail[]>(
    `${APIURL.CHAINS}`,
    {method: HttpMethod.GET}
  );

  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('CHAINS_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.CHAINS,
    },
  ];

  const displayChains = isChainLoading ? (
    // Info: (20240219 - Julian) Skeleton
    <div className="flex w-250px flex-col space-y-3 rounded-xl border border-transparent bg-darkPurple p-4 shadow-xl">
      <div className="inline-flex items-center gap-4">
        <Skeleton width={60} height={60} rounded />
        <Skeleton width={100} height={20} />
      </div>
      <Skeleton width={100} height={20} />
      <Skeleton width={100} height={20} />
    </div>
  ) : (
    chainData?.map((chain, index) => <ChainsCard key={index} chainData={chain} />)
  );

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
        <div className="">
          <Breadcrumb crumbs={crumbs} />
        </div>
        <div className="flex justify-center p-10">
          <h1 className="text-2xl font-bold lg:text-48px">
            {t('CHAINS_PAGE.TITLE')}
            <span className="text-primaryBlue"> {t('CHAINS_PAGE.TITLE_HIGHLIGHT')}</span>
          </h1>
        </div>

        {/* Info: (20230829 - Julian) Chain list */}
        <div className="mx-auto grid grid-cols-1 gap-6 pt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayChains}
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AllChainPageBody;
