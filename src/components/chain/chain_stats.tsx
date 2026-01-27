'use client';

import { IChainStat, IDetailedStats } from '@/interfaces/chain';

type Props = {
  stats?: IChainStat[];
  details?: IDetailedStats;
  showDetails?: boolean;
  latestBlockNumber?: string;
  latestGasPrice?: string;
};

export default function ChainStats({
  stats,
  details,
  showDetails,
  latestBlockNumber,
  latestGasPrice,
}: Props) {
  if (!stats) return null;

  // Helper to get value with dynamic override
  const getDisplayValue = (stat: IChainStat) => {
    const label = stat.label.toLowerCase();
    if (label.includes('最佳手續費') || label.includes('gas 均價')) {
      return latestGasPrice || '0';
    }
    if (label.includes('區塊高度')) {
      return latestBlockNumber || '0';
    }
    return stat.value;
  };

  return (
    <div className="mb-8 overflow-x-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Detailed Stats Grid - Only visible when toggled ON */}
      {showDetails && details && (
        <div className="mb-8 grid grid-cols-1 gap-8 border-b border-gray-100 pb-8 lg:grid-cols-4">
          {/* Transactions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">交易概覽</h3>
            <div className="space-y-4">
              {details.transactions.map((stat, i) => (
                <div key={i}>
                  <div className="mb-1 text-xs text-gray-500">{stat.label}</div>
                  <div className="font-bold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">地址概覽</h3>
            <div className="space-y-4">
              {details.addresses.map((stat, i) => (
                <div key={i}>
                  <div className="mb-1 text-xs text-gray-500">{stat.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-gray-900">{stat.value}</div>
                    {stat.subValue && <div className="text-xs text-green-500">{stat.subValue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tokens */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">代幣概覽</h3>
            <div className="space-y-4">
              {details.tokens.map((stat, i) => (
                <div key={i}>
                  <div className="mb-1 text-xs text-gray-500">{stat.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-blue-600">{stat.value}</div>
                    {stat.subValue && <div className="text-xs text-green-500">{stat.subValue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">概覽</h3>
            <div className="space-y-4">
              {details.overview.map((stat, i) => (
                <div key={i}>
                  <div className="mb-1 text-xs text-gray-500">{stat.label}</div>
                  <div className="font-bold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Basic Stats Bar */}
      <div className="flex w-full flex-col md:flex-row">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col border-b border-gray-100 px-0 py-4 first:pt-0 last:border-0 last:pb-0 md:border-r md:border-b-0 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0"
          >
            <div className="mb-2 text-xs font-medium tracking-wide text-gray-400">{stat.label}</div>
            <div className="flex h-8 items-center gap-3">
              <span className="text-xl font-bold tracking-tight whitespace-nowrap text-gray-900">
                {getDisplayValue(stat)}
              </span>
              {stat.change && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${stat.isNegative ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {stat.change}
                  </span>
                  {/* Mock Sparkline */}
                  <svg
                    width="60"
                    height="20"
                    viewBox="0 0 60 20"
                    className="hidden opacity-70 xl:block"
                  >
                    <path
                      d={stat.isNegative ? 'M0 5 Q15 5 30 15 T60 18' : 'M0 15 Q15 15 30 5 T60 2'}
                      fill="none"
                      stroke={stat.isNegative ? '#ef4444' : '#22c55e'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
