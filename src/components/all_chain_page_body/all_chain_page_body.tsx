import {useState, useEffect} from 'react';
import Footer from '../footer/footer';
import ChainsCard from '../chain_card/chain_card';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import {IChain} from '../../interfaces/chain';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {getChainIcon} from '../../lib/common';
import {APIURL} from '../../constants/api_request';

const AllChainPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [chainList, setChainList] = useState<IChain[]>([]);

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

  const getChains = async () => {
    let data: IChain[] = [];
    try {
      const response = await fetch(`${APIURL.CHAINS}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getChains error', error);
    }
    return data;
  };

  useEffect(() => {
    getChains().then(data => setChainList(data));
  }, []);

  const displayChains = chainList.map((chain, index) => (
    <ChainsCard
      key={index}
      chainId={chain.chainId}
      chainName={chain.chainName}
      icon={getChainIcon(chain.chainId).src}
      blocks={chain.blocks}
      transactions={chain.transactions}
    />
  ));

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
