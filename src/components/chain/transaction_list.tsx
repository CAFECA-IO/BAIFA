'use client';

import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CopyButton from '@/components/common/copy_button';
import { ITransaction } from '@/interfaces/chain';
import { truncateAddress } from '@/lib/utils/format';

interface ITransactionListProps {
  transactions: ITransaction[];
  isLoading: boolean;
}

const TransactionItem = ({ txn }: { txn: ITransaction }) => {
  const params = useParams();
  const chainId = params?.chainId as string;

  const transactionPath = `/chain/${chainId}/txs/${txn.hash}`;
  const fromPath = `/chain/${chainId}/address/${txn.from}`;
  const toPath = `/chain/${chainId}/address/${txn.to}`;

  const fromStr = txn.from.startsWith('0x') ? truncateAddress(txn.from, 10, 4) : txn.from;
  const toStr = txn.to.startsWith('0x') ? truncateAddress(txn.to, 10, 4) : txn.to;

  return (
    <div className="animate-block-in flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
      {/* Info: (20260130 - Julian) Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
        Tx
      </div>

      {/* Info: (20260130 - Julian) Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 grid grid-cols-6 gap-2 text-sm">
          <Link
            href={transactionPath}
            className="col-span-2 flex items-center hover:underline"
            title={txn.hash}
          >
            <p className="overflow-hidden font-bold text-ellipsis whitespace-nowrap text-[#5841D8]">
              {txn.hash}
            </p>
          </Link>
          <div className="col-span-1 flex items-center text-xs whitespace-nowrap text-gray-400">
            發送方
          </div>
          <div className="col-span-3 flex items-center gap-1.5">
            <Link href={fromPath} className="font-mono text-[#5841D8] hover:underline">
              {fromStr}
            </Link>
            <CopyButton value={txn.from} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2 text-sm">
          <span className="col-span-2 flex items-center text-xs text-gray-500">{txn.time}</span>
          <span className="col-span-1 flex items-center text-xs whitespace-nowrap text-gray-400">
            接收方
          </span>
          <div className="col-span-3 flex items-center gap-1.5">
            <Link href={toPath} className="font-mono text-[#5841D8] hover:underline">
              {toStr}
            </Link>
            <CopyButton value={txn.to} />
          </div>
        </div>
      </div>

      {/* Info: (20260130 - Julian) Value */}
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-gray-900">{txn.value} ISC</div>
      </div>
    </div>
  );
};

export default function TransactionList({ transactions, isLoading }: ITransactionListProps) {
  const pathName = usePathname();
  const transactionListPath = `${pathName}/txs`;

  const displayedTransactions = isLoading ? (
    <div className="flex h-full items-center justify-center p-6">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  ) : transactions.length > 0 ? (
    transactions.map((txn) => <TransactionItem key={txn.hash} txn={txn} />)
  ) : (
    <div className="flex h-full items-center justify-center p-6 text-gray-400">尚無數據</div>
  );

  return (
    <div className="flex flex-col items-stretch rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">最新交易</h3>
        <Link href={transactionListPath}>
          <ArrowRight size={20} className="cursor-pointer text-gray-400 hover:text-[#5841D8]" />
        </Link>
      </div>

      <div className="custom-scrollbar flex-1 space-y-6 pr-2">{displayedTransactions}</div>

      <Link
        href={transactionListPath}
        className="mt-6 w-full rounded-full bg-black py-3 text-center text-sm font-bold text-white transition hover:bg-[#5841D8]"
      >
        查看全部交易
      </Link>
    </div>
  );
}
