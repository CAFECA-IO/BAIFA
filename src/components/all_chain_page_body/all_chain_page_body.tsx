import Footer from '../footer/footer';
import ChainsCard from '../chain_card/chain_card';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const AllChainPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex w-full flex-1 flex-col px-20 pt-20 lg:pt-32">
        <div className="">
          <p>Breadcrumb</p>
        </div>
        <div className="flex justify-center p-10">
          <h1 className="text-48px font-bold">
            {t('CHAINS_PAGE.TITLE')}
            <span className="text-primaryBlue"> {t('CHAINS_PAGE.TITLE_HIGHLIGHT')}</span>
          </h1>
        </div>

        {/* Info: (20230829 - Julian) Chain list */}
        <div className="grid gap-6 pt-5">
          <ChainsCard
            chainId="bolt"
            chainName="BOLT"
            icon="/currencies/bolt.svg"
            blocks={12093}
            transactions={33233}
          />
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AllChainPageBody;
