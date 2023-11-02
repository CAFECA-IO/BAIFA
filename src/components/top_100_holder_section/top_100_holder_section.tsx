import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import useStateRef from 'react-usestateref';
import SortingMenu from '../sorting_menu/sorting_menu';
import SearchBar from '../search_bar/search_bar';
import BoltButton from '../bolt_button/bolt_button';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'react-i18next';
import {sortOldAndNewOptions} from '../../constants/config';
import {getChainIcon, roundToDecimal, withCommas} from '../../lib/common';
import {ICurrency} from '../../interfaces/currency';
import {getDynamicUrl} from '../../constants/url';

interface ITop100HolderSectionProps {
  currencyData: ICurrency;
}

const Top100HolderSection = ({currencyData}: ITop100HolderSectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {currencyId, holders, totalAmount, unit} = currencyData;

  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);
  const [search, setSearch, searchRef] = useStateRef('');

  const chainIcon = getChainIcon(currencyId);

  const maxholdingAmount = holders.reduce((prev, current) =>
    prev.holdingAmount > current.holdingAmount ? prev : current
  ).holdingAmount;

  const holderList = holders.map((holder, index) => {
    const holdingPercentage = roundToDecimal((holder.holdingAmount / totalAmount) * 100, 2);
    const holdingBarWidth = (holder.holdingAmount / maxholdingAmount) * 100;

    const addressLink = getDynamicUrl(currencyId, holder.addressId).ADDRESS;

    return (
      // Info: (20231102 - Julian) Top 100 Holder Item
      <div key={index} className="flex h-60px items-center border-b border-darkPurple4 px-6">
        <Link href={addressLink} className="flex flex-1 items-center space-x-4">
          <BoltButton className="px-3 py-2 text-sm" style="solid" color="purple">
            {holder.type}
          </BoltButton>
          {/* Info: (20231102 - Julian) Address ID */}
          <div className="flex items-center space-x-2 text-xl">
            <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
            <p>
              {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
              <span className="ml-2 font-semibold text-primaryBlue">{holder.addressId}</span>
            </p>
          </div>
        </Link>
        {/* Info: (20231102 - Julian) Holding Amount */}
        <div className="flex w-300px flex-col items-end text-sm">
          <p>
            {withCommas(holder.holdingAmount)} {unit}
          </p>
          <div className="relative flex w-full justify-end px-2 py-px">
            <p className="relative z-10">{holdingPercentage} %</p>
            {/* Info: (20231102 - Julian) Holding Amount Bar */}
            <span
              className="absolute right-0 top-0 h-20px bg-lightBlue opacity-50"
              style={{width: `${holdingBarWidth}%`}}
            ></span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg shadow-xl">
      <h2 className="text-xl text-lilac">Top 100 Holders</h2>
      <div className="flex w-full flex-col bg-darkPurple p-4">
        {/* Info: (20231102 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end space-y-4">
          {/* Info: (20231102 - Julian) Sorting Menu */}
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
              isLinearBg={true}
            />
          </div>
          {/* Info: (20231102 - Julian) Search Bar */}
          <SearchBar
            searchBarPlaceholder={t('COMMON.TOP_100_HOLDER_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        {/* Info: (20231102 - Julian) Address List */}
        <div className="mt-8 flex w-full flex-col">{holderList}</div>
      </div>
    </div>
  );
};

export default Top100HolderSection;
