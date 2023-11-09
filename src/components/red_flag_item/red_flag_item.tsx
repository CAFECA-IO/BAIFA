import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import {getChainIcon, timestampToString} from '../../lib/common';
import {IRedFlag} from '../../interfaces/red_flag';

interface IRedFlagItemProps {
  redflagData: IRedFlag;
}

const RedFlagItem = ({redflagData}: IRedFlagItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const chainIcon = getChainIcon(redflagData.chainId);

  const flaggingTime = timestampToString(redflagData.flaggingTimestamp);
  // Info: (20231109 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(flaggingTime.month).length > 3
      ? `${t(flaggingTime.month).slice(0, 3)}.`
      : t(flaggingTime.month);

  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20231109 - Julian) Flagging Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{flaggingTime.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{flaggingTime.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
        {/* Info: (20231109 - Julian) Address ID */}
        <Link
          // ToDo: (20231109 - Julian) link
          href={BFAURL.COMING_SOON}
          className="flex flex-1 items-center space-x-2 text-sm font-bold lg:text-xl"
        >
          <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
          <h2>
            {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
            <span className="text-primaryBlue"> {redflagData.addressId}</span>
          </h2>
        </Link>
        {/* Info: (20231109 - Julian) Flag Type */}
        <div className="flex items-center space-x-2 px-2">
          <Image src="/icons/red_flag.svg" alt="red_flag_icon" width={24} height={24} />
          <p className="hidden text-sm lg:block">{t(redflagData.redFlagType)}</p>
        </div>
      </div>
    </div>
  );
};

export default RedFlagItem;
