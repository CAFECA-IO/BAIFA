import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import useStateRef from 'react-usestateref';
import SearchBar from '../search_bar/search_bar';
import BoltButton from '../bolt_button/bolt_button';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'next-i18next';
import {DEFAULT_CURRENCY_ICON, ITEM_PER_PAGE} from '../../constants/config';
import {getCurrencyIcon} from '../../lib/common';
import {ICurrencyDetailString, IHolder} from '../../interfaces/currency';
import {getDynamicUrl} from '../../constants/url';
import Pagination from '../pagination/pagination';

interface ITop100HolderSectionProps {
  currencyData: ICurrencyDetailString;
}

const Top100HolderSection = ({currencyData}: ITop100HolderSectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {holders, holderCount, unit, chainId, currencyId} = currencyData;

  const currencyIcon = getCurrencyIcon(currencyId);

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(holderCount / ITEM_PER_PAGE));
  const [filteredHolderData, setFilteredHolderData] = useState<IHolder[]>(holders);
  const [search, setSearch, searchRef] = useStateRef('');

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    const searchResult = holders.filter(holder => {
      // Info: (20231101 - Julian) filter by search term
      const searchTerm = searchRef.current.toLowerCase();
      const addressId = holder.addressId.toString().toLowerCase();
      const publicTag = holder.publicTag
        ? holder.publicTag.map(tag => tag.toLowerCase()).join(',')
        : '';
      return searchTerm !== ''
        ? addressId.includes(searchTerm) || publicTag.includes(searchTerm)
        : true;
    });

    setFilteredHolderData(searchResult);
    setTotalPages(Math.ceil(searchResult.length / ITEM_PER_PAGE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const holderList = filteredHolderData
    // Info: (20231102 - Julian) Pagination
    .slice(startIdx, endIdx)
    // Info: (20240202 - Julian) 依照持有比例降冪排序
    .sort((a, b) => {
      // Info: (20240221 - Liz) 持有數字串先補零再以字串排序
      const paddedHoldingAmountA = a.holdingAmount.padStart(64, '0');
      const paddedHoldingAmountB = b.holdingAmount.padStart(64, '0');
      if (paddedHoldingAmountA > paddedHoldingAmountB) return -1;
      if (paddedHoldingAmountA < paddedHoldingAmountB) return 1;
      return 0;
    })
    .map((holder, index) => {
      const holdingPercentage = holder.holdingPercentage;
      const addressLink = getDynamicUrl(chainId, holder.addressId).ADDRESS;
      // Info: (20240206 - Julian) 最多顯示 100% 的持有比例
      const holdingBarWidth = holder.holdingBarWidth > 100 ? 100 : holder.holdingBarWidth;

      const displayedPublicTag = holder.publicTag ? (
        <BoltButton className="px-3 py-2 text-sm" style="solid" color="purple">
          {t(holder.publicTag[0])}
        </BoltButton>
      ) : (
        <></>
      );

      return (
        // Info: (20231102 - Julian) Top 100 Holder Item
        <div
          key={index}
          className="flex flex-col items-start border-b border-darkPurple4 px-1 lg:h-60px lg:flex-row lg:items-center lg:px-4"
        >
          {/* Info: (20231102 - Julian) Address ID (Desktop) */}
          <Link href={addressLink} className="hidden flex-1 items-center space-x-4 lg:flex">
            {displayedPublicTag}
            <div className="inline-flex flex-1 items-center space-x-2 text-xl font-semibold text-primaryBlue">
              <Image
                src={currencyIcon.src}
                alt={currencyIcon.alt}
                width={30}
                height={30}
                onError={e => (e.currentTarget.src = DEFAULT_CURRENCY_ICON)}
              />
              <p
                title={holder.addressId}
                className="w-300px grow overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <span className="text-hoverWhite">{t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} </span>
                {holder.addressId}
              </p>
            </div>
          </Link>
          {/* Info: (20231102 - Julian) Holding Amount */}
          <div className="flex w-full flex-col space-y-1 text-sm lg:w-300px lg:space-y-0">
            {/* Info: (20231102 - Julian) Address ID (Mobile) */}
            <Link href={addressLink} className="flex space-x-4 lg:hidden">
              <div className="inline-flex flex-1 items-center space-x-2 text-sm text-primaryBlue">
                <Image
                  src={currencyIcon.src}
                  alt={currencyIcon.alt}
                  width={20}
                  height={20}
                  onError={e => (e.currentTarget.src = DEFAULT_CURRENCY_ICON)}
                />
                <p className="w-200px grow overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="text-hoverWhite">{t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} </span>
                  {holder.addressId}
                </p>
              </div>
            </Link>

            {/* Info: (20231102 - Julian) Holding Amount */}
            <p className="text-right">
              {holder.holdingAmount} {unit}
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
    <div className="flex w-full flex-col space-y-4">
      <h2 className="text-xl text-lilac">{t('COMMON.TOP_100_HOLDERS_TITLE')}</h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple p-4 drop-shadow-xl">
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
