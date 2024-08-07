import {useState} from 'react';
import {useTranslation} from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {DEFAULT_CURRENCY_ICON, DEFAULT_PAGE, ITEM_PER_PAGE} from '@/constants/config';
import {getDynamicUrl} from '@/constants/url';
import {ITop100Holders} from '@/interfaces/currency';
import {TranslateFunction} from '@/interfaces/locale';
import {getCurrencyIcon} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';
import SearchBar from '@/components/search_bar/search_bar';
import BoltButton from '@/components/bolt_button/bolt_button';
import Pagination from '@/components/pagination/pagination';
import {SkeletonList} from '@/components/skeleton/skeleton';

interface ITop100HolderSectionProps {
  chainId: string;
  currencyId: string;
  unit: string;
  currencyIconId: string;
}

const Top100HolderSection = ({
  chainId,
  currencyId,
  unit,
  currencyIconId,
}: ITop100HolderSectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const router = useRouter();
  const {page} = router.query;

  // Info: (20240312 - Liz) 搜尋條件
  const [search, setSearch] = useState('');

  const [activePage, setActivePage] = useState<number>(page ? +page : DEFAULT_PAGE);

  // Info: (20240402 - Liz) Call API to get Top 100 Holders data (API - 028)
  const {data: top100HoldersData, isLoading} = useAPIResponse<ITop100Holders>(
    `${APIURL.CURRENCIES}/${currencyId}/top100Holders`,
    // Info: (20240402 - Liz) 預設值 ?page=1&offset=10&search=
    {method: HttpMethod.GET},
    {
      page: activePage,
      offset: ITEM_PER_PAGE,
      search: search,
    }
  );

  // Info: (20240402 - Liz) 從 API 取得總頁數
  const totalPages = top100HoldersData?.totalPages ?? 0;

  const currencyIcon = getCurrencyIcon(currencyIconId);

  const holderList =
    top100HoldersData?.holdersData && top100HoldersData?.holdersData.length > 0 ? (
      top100HoldersData.holdersData.map((holder, index) => {
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
          // Info: (20231102 - Julian) Top 100 Holders Item
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
                  <span className="text-hoverWhite">
                    {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}{' '}
                  </span>
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
                    <span className="text-hoverWhite">
                      {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}{' '}
                    </span>
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
      })
    ) : (
      <h2>{t('COMMON.NO_DATA')}</h2>
    );

  const displayedHolders = !isLoading ? holderList : <SkeletonList count={ITEM_PER_PAGE} />;

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
            setActivePage={setActivePage}
          />
        </div>
        {/* Info: (20231102 - Julian) Address List */}
        <div className="my-10 flex w-full flex-col space-y-2 lg:space-y-0">{displayedHolders}</div>
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Top100HolderSection;
