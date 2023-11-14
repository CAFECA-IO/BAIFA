import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import BoltButton from '../../components/bolt_button/bolt_button';
import {getChainIcon, getTimeString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {IAddress} from '../../interfaces/address';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

interface IBlacklistItemProps {
  address: IAddress;
}

const BlacklistItem = ({address}: IBlacklistItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, chainId, lastestActiveTime, publicTag} = address;

  const [sinceTime, setSinceTime] = useState(0);

  const addressLink = getDynamicUrl(chainId, id).ADDRESS;
  const chainIcon = getChainIcon(chainId);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);

    // Info: (20231113 - Julian) 算出 lastestActiveTime 距離現在過了多少時間
    timer = setTimeout(() => {
      const now = Math.ceil(Date.now() / 1000);
      const timeSpan = now - lastestActiveTime;
      setSinceTime(timeSpan);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sinceTime]);

  return (
    <div className="flex flex-col items-start border-b border-darkPurple4 px-4 py-2 lg:h-60px lg:flex-row lg:items-center">
      {/* Info: (20231113 - Julian) Address ID */}
      <Link href={addressLink} className="flex flex-1 items-center space-x-4">
        <BoltButton className="px-3 py-2 text-sm" style="solid" color="purple">
          {t(publicTag[0])}
        </BoltButton>
        <div className="flex items-center space-x-2 text-xl">
          <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
          <p>
            {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
            <span className="ml-2 font-semibold text-primaryBlue">{id}</span>
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
