import {timestampToString} from '../../lib/common';
import {IBlockData} from '../../interfaces/block_data';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

export interface IBlockItemProps {
  block: IBlockData;
}

const BlockItem = ({block}: IBlockItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // ToDo: (20230904 - Julian) i18n
  const stabilityColor = block.stabilityLevel === 'LOW' ? '#FC8181' : '#3DD08C';

  return (
    <div className="flex h-60px w-full items-center">
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{timestampToString(block.createdTimestamp).day}</p>
        <p className="text-xs">{timestampToString(block.createdTimestamp).month}</p>
        <p className="text-xs text-lilac">{timestampToString(block.createdTimestamp).time}</p>
      </div>

      <div className="flex h-full flex-1 items-center border-b border-darkPurple4 pl-8">
        <h2 className="flex-1 text-xl">
          Block <span className="text-primaryBlue">{block.id}</span>
        </h2>
        <div className="flex items-center space-x-2 px-2">
          <p className="text-sm">Stability :</p>
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
