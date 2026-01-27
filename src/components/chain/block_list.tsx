'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { IBlock } from '@/interfaces/chain';
import { usePathname } from 'next/navigation';

interface IBlockListProps {
  blocks: IBlock[];
  loading?: boolean;
}

const BlockItem = ({ block }: { block: IBlock }) => {
  const pathname = usePathname();
  const addressPath = `${pathname}/address/${block.proposerLabel}`;

  return (
    <div
      key={block.height}
      className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
    >
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
        Bk
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="font-bold text-[#5841D8] hover:underline">
            {block.height}
          </Link>
          <span className="text-xs text-gray-400">出塊者</span>
          <Link
            href={addressPath}
            className="w-0 flex-1 truncate text-[#5841D8] hover:underline"
            title={block.proposerLabel}
          >
            {block.proposer}
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{block.time}</span>
          <span>{block.txns} 筆交易</span>
          <span className="truncate">獎勵 {block.reward}</span>
        </div>
      </div>

      {/* Gas */}
      <div className="flex shrink-0 items-center gap-1 rounded border border-orange-100 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500">
        ⛽ {block.gas}
      </div>
    </div>
  );
};

export default function BlockList({ blocks, loading }: IBlockListProps) {
  const pathname = usePathname();
  const blockListPath = `${pathname}/blocks`;
  // const addressPath = `${pathname}/address/${block.proposerLabel}`;

  return (
    <div className="flex flex-col items-stretch rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">最新區塊</h3>
        <Link href={blockListPath}>
          <ArrowRight size={20} className="cursor-pointer text-gray-400 hover:text-[#5841D8]" />
        </Link>
      </div>

      <div className="custom-scrollbar h-[430px] space-y-6 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : blocks.length > 0 ? (
          blocks.map((block) => <BlockItem key={block.height} block={block} />)
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">尚無數據</div>
        )}
      </div>

      <Link
        href={blockListPath}
        className="mt-6 w-full rounded-full bg-black py-3 text-center text-sm font-bold text-white transition hover:bg-[#5841D8]"
      >
        查看全部區塊
      </Link>
    </div>
  );
}
