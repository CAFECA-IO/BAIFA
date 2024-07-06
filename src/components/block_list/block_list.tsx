import {useTranslation} from 'next-i18next';
import {IBlockBrief} from '@/interfaces/block';
import {TranslateFunction} from '@/interfaces/locale';
import BlockItem from '@/components/block_item/block_item';

export interface IBlockListProps {
  blockData: IBlockBrief[];
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
