import {useState, useEffect} from 'react';
import BlockItem from '../block_item/block_item';
import Pagination from '../pagination/pagination';
import {ITEM_PER_PAGE} from '../../constants/config';
import {IBlock} from '../../interfaces/block';

export interface IBlockListProps {
  blockData: IBlock[];
}

const BlockList = ({blockData}: IBlockListProps) => {
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(blockData.length / ITEM_PER_PAGE));

  const endIdx = activePage * ITEM_PER_PAGE;
  const startIdx = endIdx - ITEM_PER_PAGE;

  useEffect(() => {
    setActivePage(1);
    setTotalPages(Math.ceil(blockData.length / ITEM_PER_PAGE));
  }, [blockData]);

  const blockList = blockData
    .map((block, index) => <BlockItem key={index} block={block} />)
    .slice(startIdx, endIdx);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-320px w-full flex-col items-center py-10">{blockList}</div>
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </div>
  );
};

export default BlockList;
