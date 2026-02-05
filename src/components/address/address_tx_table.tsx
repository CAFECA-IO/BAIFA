'use client';

import { IAlchemyTransaction } from '@/interfaces/alchemy';

interface IAddressTxTableProps {
  address: string;
  transactions: IAlchemyTransaction[];
}

const AddressTxTable = ({ address, transactions }: IAddressTxTableProps) => {
  const txList =
    transactions.length > 0 ? (
      transactions.map((tx) => {
        const isOut = tx.from.toLowerCase() === address.toLowerCase();
        const validValue = tx.value ? tx.value.toString() : '0';

        return (
          <tr key={tx.hash} className="transition-colors hover:bg-gray-50/50">
            <td className="max-w-[120px] truncate px-6 py-4 font-mono text-blue-600">{tx.hash}</td>
            <td className="px-6 py-4">
              <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                {tx.category === 'erc20' ? 'Token Transfer' : 'ETH transfer'}
              </span>
            </td>
            <td className="px-6 py-4 text-blue-600">{parseInt(tx.blockNum, 16)}</td>
            <td className="px-6 py-4 font-mono">
              {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
            </td>
            <td className="px-6 py-4">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isOut
                    ? 'border border-orange-100 bg-orange-50 text-orange-600'
                    : 'border border-green-100 bg-green-50 text-green-600'
                }`}
              >
                {isOut ? 'OUT' : 'IN'}
              </span>
            </td>
            <td className="px-6 py-4 font-mono">
              {tx.to?.slice(0, 6)}...{tx.to?.slice(-4)}
            </td>
            <td className="px-6 py-4 font-bold">
              {isOut ? '-' : '+'}
              {parseFloat(validValue).toFixed(6)} {tx.asset}
            </td>
            <td className="px-6 py-4 text-gray-400">0.00000...</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={8} className="p-10 text-center font-semibold">
          <p className="text-gray-900">尚無數據</p>
        </td>
      </tr>
    );

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="text-xs font-medium text-gray-400 uppercase">
          <tr>
            <th className="border-b border-gray-200 px-6 py-4">交易哈希</th>
            <th className="border-b border-gray-200 px-6 py-4">方法</th>
            <th className="border-b border-gray-200 px-6 py-4">區塊</th>
            <th className="border-b border-gray-200 px-6 py-4">發送方</th>
            <th className="border-b border-gray-200 px-6 py-4">
              {/* Info: (20260204 - Julian) IN/OUT 標籤 */}
            </th>
            <th className="border-b border-gray-200 px-6 py-4">接收方</th>
            <th className="border-b border-gray-200 px-6 py-4">數量</th>
            <th className="border-b border-gray-200 px-6 py-4">手續費</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{txList}</tbody>
      </table>
    </div>
  );
};

export default AddressTxTable;
