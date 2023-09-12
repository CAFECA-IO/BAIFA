import Footer from '../footer/footer';
import ChainsCard from '../chain_card/chain_card';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import {dummyChains} from '../../interfaces/chain_data';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';

const AllChainPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

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
        <div className="mx-auto grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2 xl:grid-cols-4">
          {dummyChains.map((chain, index) => (
            <ChainsCard
              key={index}
              chainId={chain.chainId}
              chainName={chain.chainName}
              icon={chain.icon}
              blocks={chain.blocks.length}
              transactions={chain.transactions.length}
            />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AllChainPageBody;
