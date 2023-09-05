import {timestampToString} from '../../lib/common';
import {IBlockData} from '../../interfaces/block_data';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

export interface IBlockItemProps {
  block: IBlockData;
}

const BlockItem = ({block}: IBlockItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const stabilityColor =
    block.stabilityLevel === 'LOW'
      ? '#FC8181'
      : block.stabilityLevel === 'MEDIUM'
      ? '#FFA600'
      : '#3DD08C';

  const createdStr = timestampToString(block.createdTimestamp);
  // Info: (20230905 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  return (
    <div className="flex h-60px w-full items-center">
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-8">
        <h2 className="flex-1 text-xl">
          {t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')} <span className="text-primaryBlue">{block.id}</span>
        </h2>
        <div className="flex items-center space-x-2 px-2">
          <p className="text-sm">{t('CHAIN_DETAIL_PAGE.STABILITY')} :</p>
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
