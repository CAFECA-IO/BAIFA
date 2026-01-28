'use client';

import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CopyButton from '@/components/common/copy_button';
import { ITransaction } from '@/interfaces/chain';

interface ITransactionListProps {
  transactions: ITransaction[];
  loading?: boolean;
}

const TransactionItem = ({ txn }: { txn: ITransaction }) => {
  const params = useParams();
  const chainId = params?.chainId as string;
  const fromPath = `/chain/${chainId}/address/${txn.fromLabel}`;
  const toPath = `/chain/${chainId}/address/${txn.toLabel}`;

  const displayFrom = !!txn.from ? (
    <div className="flex items-center gap-1.5">
      <Link href={fromPath} className="font-mono text-[#5841D8] hover:underline">
        {txn.from}
      </Link>
      <CopyButton value={txn.fromLabel ?? txn.from} />
    </div>
  ) : (
    <p className="font-mono text-gray-600">Unknown</p>
  );
  const displayTo = !!txn.to ? (
    <div className="flex items-center gap-1.5">
      <Link href={toPath} className="font-mono text-[#5841D8] hover:underline">
        {txn.to}
      </Link>
      <CopyButton value={txn.toLabel ?? txn.to} />
    </div>
  ) : (
    <p className="font-mono text-gray-600">Unknown</p>
  );

  return (
    <div className="animate-block-in flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
        Tx
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 grid grid-cols-6 gap-2 text-sm">
          <Link
            href="/"
            className="col-span-2 truncate font-bold text-[#5841D8] hover:underline"
            title={txn.hash}
          >
            {txn.hash}
          </Link>
          <span className="col-span-1 text-xs text-nowrap text-gray-400">發送方</span>
          {displayFrom}
        </div>
        <div className="grid grid-cols-6 gap-2 text-sm">
          <span className="col-span-2 text-xs text-gray-500">{txn.time}</span>
          <span className="col-span-1 text-xs text-nowrap text-gray-400">接收方</span>
          {displayTo}
        </div>
      </div>

      {/* Value */}
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-gray-900">{txn.value}</div>
      </div>
    </div>
  );
};

export default function TransactionList({ transactions, loading }: ITransactionListProps) {
  const pathName = usePathname();
  const transactionListPath = `${pathName}/transactions`;

  return (
    <div className="flex flex-col items-stretch rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">最新交易</h3>
        <Link href={transactionListPath}>
          <ArrowRight size={20} className="cursor-pointer text-gray-400 hover:text-[#5841D8]" />
        </Link>
      </div>

      <div className="custom-scrollbar flex-1 space-y-6 pr-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((txn) => <TransactionItem key={txn.hash} txn={txn} />)
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">尚無數據</div>
        )}
      </div>

      <Link
        href={transactionListPath}
        className="mt-6 w-full rounded-full bg-black py-3 text-center text-sm font-bold text-white transition hover:bg-[#5841D8]"
      >
        查看全部交易
      </Link>
    </div>
  );
}
