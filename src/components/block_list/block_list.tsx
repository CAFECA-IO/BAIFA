import BlockItem from '../block_item/block_item';
import {IBlock} from '../../interfaces/block';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

export interface IBlockListProps {
  blockData: IBlock[];
}

const BlockList = ({blockData}: IBlockListProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const blockList =
    blockData.length > 0 ? (
      blockData.map((block, index) => <BlockItem key={index} block={block} />)
    ) : (
      <h2>{t('COMMON.NO_DATA')}</h2>
    );

  return <div className="flex min-h-320px w-full flex-col items-center py-10">{blockList}</div>;
};

export default BlockList;
