'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ITransaction } from '@/interfaces/chain';
import { usePathname } from 'next/navigation';

interface ITransactionListProps {
  transactions: ITransaction[];
  loading?: boolean;
}

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

      <div className="custom-scrollbar h-[430px] space-y-6 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((txn) => (
            <div
              key={txn.hash}
              className="animate-block-in flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
            >
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
                  <Link
                    href="/"
                    className="col-span-3 max-w-[100px] truncate text-[#5841D8] hover:underline sm:max-w-[140px]"
                    title={txn.fromLabel}
                  >
                    {txn.from}
                  </Link>
                </div>
                <div className="grid grid-cols-6 gap-2 text-sm">
                  <span className="col-span-2 text-xs text-gray-500">{txn.time}</span>
                  <span className="col-span-1 text-xs text-nowrap text-gray-400">接收方</span>
                  <Link
                    href="/"
                    className="col-span-3 max-w-[100px] truncate text-[#5841D8] hover:underline sm:max-w-[140px]"
                    title={txn.toLabel}
                  >
                    {txn.to}
                  </Link>
                </div>
              </div>

              {/* Value */}
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-gray-900">{txn.value}</div>
              </div>
            </div>
          ))
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
