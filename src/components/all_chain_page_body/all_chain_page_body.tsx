import {useState} from 'react';
import Footer from '../footer/footer';
import ChainsCard from '../chain_card/chain_card';
import DatePicker from '../date_picker/date_picker';
import {dummyChains} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IDatePeriod} from '../../interfaces/date_period';

const AllChainPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  {
    /* Till: (20230831 - Julian) Debug 用 */
  }
  const [filteredPeriod, setFilteredPeriod] = useState<IDatePeriod>({
    startTimeStamp: 0,
    endTimeStamp: 0,
  });

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex w-full flex-1 flex-col px-4 pt-32 lg:px-20">
        <div className="">
          <p>Breadcrumb</p>
        </div>
        {/* Till: (20230831 - Julian) Debug 用 */}
        <div className="">
          <p className="text-rose-300">
            filteredPeriod: {filteredPeriod.startTimeStamp} - {filteredPeriod.endTimeStamp}
          </p>
          <DatePicker filteredPeriod={filteredPeriod} setFilteredPeriod={setFilteredPeriod} />
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
