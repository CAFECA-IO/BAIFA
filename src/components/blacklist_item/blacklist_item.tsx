import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import BoltButton from '../../components/bolt_button/bolt_button';
import {getChainIcon, getTimeString, truncateText} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {IBlackList} from '../../interfaces/blacklist';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {DEFAULT_CHAIN_ICON, DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface IBlackListItemProps {
  blacklistAddress: IBlackList;
}

const BlacklistItem = ({blacklistAddress}: IBlackListItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {address, chainId, latestActiveTime, tagName, targetType} = blacklistAddress;

  const [sinceTime, setSinceTime] = useState(0);

  const addressLink = getDynamicUrl(chainId, address).ADDRESS;
  const chainIcon = getChainIcon(chainId);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Info: (20240305 - Liz) mainTitle 是根據 targetType 決定，只有兩種可能，contract 或 address
  const mainTitle =
    {
      'contract': t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_CONTRACT'),
      'address': t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS'),
    }[targetType] || '';

  useEffect(() => {
    // Info: (20231113 - Julian) 算出 latestActiveTime 距離現在過了多少時間
    timerRef.current = setTimeout(() => {
      const now = Math.ceil(Date.now() / 1000);
      const timeSpan = now - latestActiveTime;
      setSinceTime(timeSpan);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [latestActiveTime]);

  return (
    <div className="flex flex-col items-start border-b border-darkPurple4 px-4 py-2 lg:h-60px lg:flex-row lg:items-center">
      {/* Info: (20231113 - Julian) Address */}
      <Link href={addressLink} className="flex flex-1 items-center space-x-4">
        <BoltButton className="px-3 py-2 text-sm" style="solid" color="purple">
          {t(tagName)}
          {/* Todo: (20240216 - Liz) tagName尚未有內容，等之後有再調整多語言 */}
        </BoltButton>
        <div className="flex items-center space-x-2 text-sm lg:text-xl">
          <Image
            src={chainIcon.src}
            alt={chainIcon.alt}
            width={30}
            height={30}
            onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
          />
          <p title={address}>
            {mainTitle}
            <span className="ml-2 font-semibold text-primaryBlue">
              {' '}
              {truncateText(address, DEFAULT_TRUNCATE_LENGTH)}
            </span>
          </p>
        </div>
      </Link>
      {/* Info: (20231113 - Julian) Lasted Active Time */}
      <div className="flex w-full flex-col items-end space-y-1 text-sm lg:w-300px lg:space-y-0">
        <div className="hidden w-full items-center justify-end space-x-1 text-sm lg:flex">
          <p>{t('BLACKLIST_PAGE.LASTED_ACTIVE_TIME')} :</p>
          <div className="mr-2 flex items-center space-x-2">
            <p>{getTimeString(sinceTime)}</p>
            <p>{t('COMMON.AGO')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlacklistItem;
