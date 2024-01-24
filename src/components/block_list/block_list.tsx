import BlockItem from '../block_item/block_item';
import {IBlock} from '../../interfaces/block';

export interface IBlockListProps {
  blockData: IBlock[];
}

// Info: (20240119 - Julian) 考慮是否廢棄這個 component

const BlockList = ({blockData}: IBlockListProps) => {
  const blockList = blockData.map((block, index) => <BlockItem key={index} block={block} />);

  return <div className="flex min-h-320px w-full flex-col items-center py-10">{blockList}</div>;
};

export default BlockList;
