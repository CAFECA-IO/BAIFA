import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import SearchBar from '../search_bar/search_bar';
import BoltButton from '../bolt_button/bolt_button';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'react-i18next';
import {ITEM_PER_PAGE} from '../../constants/config';
import {getChainIcon, roundToDecimal, withCommas} from '../../lib/common';
import {ICurrency, IHolder} from '../../interfaces/currency';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';

interface ITop100HolderSectionProps {
  currencyData: ICurrency;
}

const Top100HolderSection = ({currencyData}: ITop100HolderSectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {currencyId, holders, totalAmount, unit} = currencyData;

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(holders.length / ITEM_PER_PAGE));
  const [filteredHolderData, setFilteredHolderData] = useState<IHolder[]>(holders);
  const [search, setSearch, searchRef] = useStateRef('');

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;
  const chainIcon = getChainIcon(currencyId);

  const maxholdingAmount = holders.reduce((prev, current) =>
    prev.holdingAmount > current.holdingAmount ? prev : current
  ).holdingAmount;

  useEffect(() => {
    const searchResult = holders.filter(holder => {
      // Info: (20231101 - Julian) filter by search term
      const searchTerm = searchRef.current.toLowerCase();
      const addressId = holder.addressId.toString().toLowerCase();
      const type = holder.type.toLowerCase();
      return searchTerm !== '' ? addressId.includes(searchTerm) || type.includes(searchTerm) : true;
    });

    setFilteredHolderData(searchResult);
    setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
  }, [search]);

  // Info: (20231102 - Julian) Pagination
  const holderList = filteredHolderData.slice(startIdx, endIdx).map((holder, index) => {
    const holdingPercentage = roundToDecimal((holder.holdingAmount / totalAmount) * 100, 2);
    const holdingBarWidth = (holder.holdingAmount / maxholdingAmount) * 100;

    const addressLink = getDynamicUrl(currencyId, holder.addressId).ADDRESS;

    return (
      // Info: (20231102 - Julian) Top 100 Holder Item
      <div
        key={index}
        className="flex flex-col items-start border-b border-darkPurple4 px-1 lg:h-60px lg:flex-row lg:items-center lg:px-4"
      >
        {/* Info: (20231102 - Julian) Address ID (Desktop) */}
        <Link href={addressLink} className="hidden flex-1 items-center space-x-4 lg:flex">
          <BoltButton className="px-3 py-2 text-sm" style="solid" color="purple">
            {holder.type}
          </BoltButton>
          <div className="flex items-center space-x-2 text-xl">
            <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
            <p>
              {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
              <span className="ml-2 font-semibold text-primaryBlue">{holder.addressId}</span>
            </p>
          </div>
        </Link>
        {/* Info: (20231102 - Julian) Holding Amount */}
        <div className="flex w-full flex-col items-end space-y-1 text-sm lg:w-300px lg:space-y-0">
          <div className="flex w-full items-center justify-between lg:justify-end">
            {/* Info: (20231102 - Julian) Address ID (Mobile) */}
            <Link href={addressLink} className="flex space-x-4 lg:hidden">
              <div className="flex items-center space-x-2 text-sm">
                <Image src={chainIcon.src} alt={chainIcon.alt} width={20} height={20} />
                <p>
                  {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 font-semibold text-primaryBlue">{holder.addressId}</span>
                </p>
              </div>
            </Link>
            {/* Info: (20231102 - Julian) Holding Amount */}
            <p>
              {withCommas(holder.holdingAmount)} {unit}
            </p>
          </div>

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
    <div className="flex w-full flex-col space-y-4">
      <h2 className="text-xl text-lilac">{t('COMMON.TOP_100_HOLDERS_TITLE')}</h2>
      <div className="flex w-full flex-col bg-darkPurple p-4">
        {/* Info: (20231102 - Julian) Search Filter */}
        <div className="flex w-full flex-col items-end space-y-4">
          {/* Info: (20231102 - Julian) Search Bar */}
          <SearchBar
            searchBarPlaceholder={t('COMMON.TOP_100_HOLDER_PLACEHOLDER')}
            setSearch={setSearch}
          />
        </div>
        {/* Info: (20231102 - Julian) Address List */}
        <div className="my-10 flex w-full flex-col space-y-2 lg:space-y-0">{holderList}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Top100HolderSection;
