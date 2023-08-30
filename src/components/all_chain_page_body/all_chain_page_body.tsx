import Footer from '../footer/footer';
import ChainsCard from '../chain_card/chain_card';
import DatePicker from '../date_picker/date_picker';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const AllChainPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const dummyChains = [
    {
      chainId: 'bolt',
      chainName: 'BOLT',
      icon: '/currencies/bolt.svg',
      blocks: 12093,
      transactions: 33233,
    },
    {
      chainId: 'eth',
      chainName: 'Ethereum',
      icon: '/currencies/ethereum.svg',
      blocks: 102000,
      transactions: 891402,
    },
    {
      chainId: 'btc',
      chainName: 'Bitcoin',
      icon: '/currencies/bitcoin.svg',
      blocks: 10053,
      transactions: 31294,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex w-full flex-1 flex-col px-4 pt-32 lg:px-20">
        <div className="">
          <p>Breadcrumb</p>
        </div>
        <div>
          <DatePicker />
        </div>
        <div className="flex justify-center p-10">
          <h1 className="text-48px font-bold">
            {t('CHAINS_PAGE.TITLE')}
            <span className="text-primaryBlue"> {t('CHAINS_PAGE.TITLE_HIGHLIGHT')}</span>
          </h1>
        </div>

        {/* Info: (20230829 - Julian) Chain list */}
        <div className="mx-auto grid grid-cols-1 gap-6 pt-5 lg:grid-cols-4">
          {dummyChains.map((chain, index) => (
            <ChainsCard
              key={index}
              chainId={chain.chainId}
              chainName={chain.chainName}
              icon={chain.icon}
              blocks={chain.blocks}
              transactions={chain.transactions}
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
