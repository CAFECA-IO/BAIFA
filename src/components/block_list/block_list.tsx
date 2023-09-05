import {useState, useEffect} from 'react';
import BlockItem from '../block_item/block_item';
import Pagination from '../pagination/pagination';
import {IBlockData} from '../../interfaces/block_data';

export interface IBlockListProps {
  blockData: IBlockData[];
}

// ToDo: (20230905 - Julian) move PER_PAGE to constants
const PER_PAGE = 3;

const BlockList = ({blockData}: IBlockListProps) => {
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(blockData.length / PER_PAGE));

  const endIdx = activePage * PER_PAGE;
  const startIdx = endIdx - PER_PAGE;

  useEffect(() => {
    setTotalPages(Math.ceil(blockData.length / PER_PAGE));
  }, [blockData]);

  const blockList = blockData
    .map((block, index) => <BlockItem key={index} block={block} />)
    .slice(startIdx, endIdx);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-320px w-full flex-col items-center py-10 lg:min-h-fit">
        {blockList}
      </div>
      <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
    </div>
  );
};

export default BlockList;
