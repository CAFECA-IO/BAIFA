import Link from 'next/link';
import {timestampToString} from '../../lib/common';
import {IBlock} from '../../interfaces/block';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {getDynamicUrl} from '../../constants/url';
import {StabilityLevel} from '../../constants/stability_level';

export interface IBlockItemProps {
  block: IBlock;
}

const BlockItem = ({block}: IBlockItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, chainId, createdTimestamp, stability} = block;

  const stabilityColor =
    stability === StabilityLevel.LOW
      ? '#FC8181'
      : stability === StabilityLevel.MEDIUM
      ? '#FFA600'
      : '#3DD08C';

  const createdStr = timestampToString(createdTimestamp);
  // Info: (20230905 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  const blockLink = getDynamicUrl(chainId, `${id}`).BLOCK;

  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20230907 - Julian) Create Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-2 lg:pl-8">
        {/* Info: (20230907 - Julian) Block ID */}
        <Link href={blockLink} className="flex-1 text-sm lg:text-xl">
          <h2>
            {t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')} <span className="text-primaryBlue">{id}</span>
          </h2>
        </Link>
        {/* Info: (20230907 - Julian) Stability */}
        <div className="flex items-center space-x-2 px-2">
          <p className="text-xs lg:text-sm">{t('CHAIN_DETAIL_PAGE.STABILITY')} :</p>
          {/* Info: (20230907 - Julian) The circle svg */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
          >
            <circle cx="7.5" cy="8.48853" r="7.5" fill={stabilityColor} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BlockItem;
