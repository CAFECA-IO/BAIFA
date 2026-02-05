'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, User } from 'lucide-react';
import { IAlchemyTransaction } from '@/interfaces/alchemy';
import { truncateAddress } from '@/lib/utils/format';
import CopyButton from '@/components/common/copy_button';
import Toggle from '@/components/common/toggle';

interface ITokenTransferTableProps {
  address: string;
  transfers: IAlchemyTransaction[];
}

const TokenTransferTable = ({ address, transfers }: ITokenTransferTableProps) => {
  const params = useParams();
  const chainId = params?.chainId as string;
  const [hideZero, setHideZero] = useState(false);

  // Info: (20260205 - Julian) 過濾為 0 的轉帳
  const filteredTransfers = hideZero
    ? transfers.filter((t) => t.value !== 0 && t.value !== null)
    : transfers;

  const renderDirection = (from: string, to: string) => {
    const isOut = from.toLowerCase() === address.toLowerCase();
    const isIn = to.toLowerCase() === address.toLowerCase();

    if (isOut) {
      return (
        <span className="rounded border border-orange-100 bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
          OUT
        </span>
      );
    }
    if (isIn) {
      return (
        <span className="rounded border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
          IN
        </span>
      );
    }
    return null;
  };

  const rows =
    filteredTransfers.length > 0 ? (
      filteredTransfers.map((tx) => {
        const isFromUser = tx.from.toLowerCase() === address.toLowerCase();
        const isToUser = tx.to?.toLowerCase() === address.toLowerCase();

        // Info: (20260205 - Julian) 時間格式化
        const displayTime = tx.metadata?.blockTimestamp
          ? new Date(tx.metadata.blockTimestamp).toLocaleString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
          : '-';

        return (
          <tr
            key={tx.uniqueId}
            className="border-b border-gray-50 bg-white transition-colors hover:bg-gray-50/50"
          >
            <td className="px-4 py-4">
              <Link
                href={`/chain/${chainId}/txs/${tx.hash}`}
                className="font-mono text-sm text-blue-600 hover:text-blue-800"
                title={tx.hash}
                aria-label={`Transaction ${tx.hash}`}
              >
                {truncateAddress(tx.hash, 8, 6)}
              </Link>
            </td>
            <td className="px-4 py-4">
              <span className="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                {tx.category === 'erc20' ? '0xef4da6d1' : tx.category}
              </span>
            </td>
            <td className="px-4 py-4 text-xs font-medium whitespace-nowrap text-gray-900">
              {displayTime}
            </td>
            <td className="px-4 py-4">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-gray-400" />
                <Link
                  href={`/chain/${chainId}/address/${tx.from}`}
                  className={`font-mono text-sm ${isFromUser ? 'text-gray-900' : 'text-blue-600 hover:underline'}`}
                  aria-label={`Address ${tx.from}`}
                >
                  {truncateAddress(tx.from)}
                </Link>
                <CopyButton value={tx.from} />
              </div>
            </td>
            <td className="px-2 py-4 text-center">{renderDirection(tx.from, tx.to)}</td>
            <td className="px-4 py-4">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-400" />
                <Link
                  href={`/chain/${chainId}/address/${tx.to}`}
                  className={`font-mono text-sm ${isToUser ? 'text-gray-900' : 'text-blue-600 hover:underline'}`}
                  aria-label={`Address ${tx.to}`}
                >
                  {truncateAddress(tx.to)}
                </Link>
                <CopyButton value={tx.to} />
              </div>
            </td>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <td className="px-4 py-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">
                  {isFromUser ? '-' : '+'}
                  {tx.value?.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </span>
                <span className="text-[10px] text-gray-400">${(tx.value || 0).toFixed(2)}</span>
              </div>
            </td>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase">
                    {tx.asset?.slice(0, 1) || '?'}
                  </div>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-blue-600">{tx.asset}</span>
                  <span className="text-[10px] text-gray-400">
                    {tx.asset === 'USDC' ? 'USD Coin' : tx.asset}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={8} className="py-20 text-center font-medium text-gray-400">
          尚無轉帳紀錄
        </td>
      </tr>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-gray-500">
          共計 <span className="font-bold text-gray-900">{transfers.length.toLocaleString()}</span>{' '}
          條數據
        </div>
        <Toggle
          isOpen={hideZero}
          onToggle={() => setHideZero(!hideZero)}
          label={{ open: '隱藏數量為 0 的轉帳', close: '隱藏數量為 0 的轉帳' }}
          labelOnRight={true}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white font-sans shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold tracking-wider text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-4">交易哈希</th>
              <th className="px-4 py-4">方法</th>
              <th className="px-4 py-4 text-[#5841D8]">時間</th>
              <th className="px-4 py-4">發送方</th>
              <th className="px-2 py-4">
                <span className="sr-only">Direction</span>
              </th>
              <th className="px-4 py-4">接收方</th>
              <th className="px-4 py-4">數量</th>
              <th className="px-4 py-4">代幣</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">{rows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenTransferTable;
