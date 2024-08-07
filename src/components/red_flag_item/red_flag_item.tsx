import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {DEFAULT_CHAIN_ICON, redFlagTypeI18nObj} from '@/constants/config';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import {IRedFlag} from '@/interfaces/red_flag';
import {getChainIcon, timestampToString} from '@/lib/common';

interface IRedFlagItemProps {
  redFlagData: IRedFlag;
}

const RedFlagItem = ({redFlagData}: IRedFlagItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, chainId, createdTimestamp, redFlagType} = redFlagData;

  const chainIcon = getChainIcon(chainId);
  const flaggingTime = timestampToString(createdTimestamp);
  // Info: (20231109 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(flaggingTime.month).length > 3
      ? `${t(flaggingTime.month).slice(0, 3)}.`
      : t(flaggingTime.month);

  const flaggingStr = redFlagTypeI18nObj[redFlagType] ?? '';

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
          href={`${BFAURL.RED_FLAG}/${id}`}
          className="inline-flex flex-1 items-center space-x-2 text-sm font-bold
          text-primaryBlue  lg:text-xl"
        >
          <Image
            src={chainIcon.src}
            alt={chainIcon.alt}
            width={30}
            height={30}
            onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
          />
          <h2
            title={id}
            className="w-200px grow overflow-hidden text-ellipsis whitespace-nowrap lg:w-500px"
          >
            <span className="text-hoverWhite">{t('COMMON.RED_FLAG_ITEM_TITLE')} </span>
            {id}
          </h2>
        </Link>
        {/* Info: (20231109 - Julian) Flag Type */}
        <div className="flex items-center space-x-2 px-2">
          <Image src="/icons/red_flag.svg" alt="red_flag_icon" width={24} height={24} />
          <p className="hidden text-sm lg:block">{t(flaggingStr)}</p>
        </div>
      </div>
    </div>
  );
};

export default RedFlagItem;
