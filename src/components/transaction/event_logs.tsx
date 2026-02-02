'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, XCircle, Info, ExternalLink } from 'lucide-react';
import { IJsonRpcReceipt, IJsonRpcLog } from '@/interfaces/rpc';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import { rpcService } from '@/lib/services/rpc_service';
import CopyButton from '@/components/common/copy_button';
import { decodeLog } from '@/lib/utils/log_parser';

interface IEventLogsProps {
  chainId: string;
  txId: string;
}

export interface ILogParameter {
  name: string;
  type: string;
  value: string; // Info: (20260202 - Julian) 保持為字串，方便 UI 轉換
  isIndexed: boolean;
}

export interface IProcessedLog {
  index: number; // Info: (20260202 - Julian) 顯示於列表左側的序號
  address: string; // Info: (20260202 - Julian) 合約地址
  addressTag?: string; // Info: (20260202 - Julian) 像是 "Uniswap V4"
  eventName: string; // Info: (20260202 - Julian) 像是 "Swap"
  eventSignature: string; // Info: (20260202 - Julian) 完整的函數定義供 UI 顯示
  topics: {
    label: string;
    value: string;
  }[];
  decodedData?: ILogParameter[]; // Info: (20260202 - Julian) 解析後的參數
  rawData: string; // Info: (20260202 - Julian) 備用的原始資料
}

const LogItem = ({
  log,
  index,
  chainId,
}: {
  log: IProcessedLog;
  index: number;
  chainId: string;
}) => {
  const [isDec, setIsDec] = useState<{ [key: string]: boolean }>({});

  const renderValue = (val: string, key: string, paramType?: string) => {
    if (!val || val === '0x') return '0x';
    const showDec = isDec[key];

    // Info: (20260202 - Julian) 偵測是否為可能的地址 (20 bytes / 40 chars + 0x)
    const isAddressType =
      paramType === 'address' ||
      (val.length === 66 && val.startsWith('0x000000000000000000000000'));
    const address = isAddressType ? (val.startsWith('0x0000') ? '0x' + val.slice(26) : val) : null;

    if (address) {
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/chain/${chainId}/address/${address}`}
            className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
          >
            {address}
          </Link>
          <CopyButton value={address} />
        </div>
      );
    }

    try {
      const dec = BigInt(val).toString();
      return (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex shrink-0 overflow-hidden rounded border border-gray-200 text-[10px]">
            <button
              onClick={() => setIsDec((prev) => ({ ...prev, [key]: true }))}
              className={`px-1.5 py-0.5 ${showDec ? 'bg-gray-100 font-bold text-gray-900' : 'bg-white text-gray-400'}`}
            >
              Dec
            </button>
            <button
              onClick={() => setIsDec((prev) => ({ ...prev, [key]: false }))}
              className={`px-1.5 py-0.5 ${!showDec ? 'bg-gray-100 font-bold text-gray-900' : 'bg-white text-gray-400'}`}
            >
              Hex
            </button>
          </div>
          <span className="font-mono break-all text-gray-700">{showDec ? dec : val}</span>
        </div>
      );
    } catch {
      return <span className="font-mono break-all text-gray-700">{val}</span>;
    }
  };

  const indexedParams = log.decodedData?.filter((p) => p.isIndexed) || [];
  const nonIndexedParams = log.decodedData?.filter((p) => !p.isIndexed) || [];

  // Info: (20260202 - Julian) Fallback for non-decoded data
  const dataChunks = [];
  if (!log.decodedData && log.rawData && log.rawData.length > 2) {
    const rawContent = log.rawData.slice(2);
    for (let i = 0; i < rawContent.length; i += 64) {
      dataChunks.push('0x' + rawContent.slice(i, i + 64));
    }
  }

  return (
    <div className="flex gap-6 border-b border-gray-100 py-8 last:border-0">
      {/* Info: (20260202 - Julian) Index */}
      <div className="shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-50 text-sm font-bold text-gray-400">
          {index}
        </div>
      </div>

      {/* Info: (20260202 - Julian) Content */}
      <div className="grow space-y-5">
        {/* Info: (20260202 - Julian) Address & Tag */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-sm font-medium text-gray-500">地址</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/chain/${chainId}/address/${log.address}`}
                className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
              >
                {log.address}
              </Link>
              <CopyButton value={log.address} />
            </div>
            {log.addressTag && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <ExternalLink size={12} /> {log.addressTag}
              </span>
            )}
          </div>
        </div>

        {/* Info: (20260202 - Julian) Event Signature */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-sm font-medium text-gray-500">事件名稱</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-900">
              <Info size={16} className="text-blue-500" />
              <span className="text-base font-bold">{log.eventName}</span>
            </div>
            {log.eventSignature && (
              <span className="rounded bg-gray-50 px-2 py-1 font-mono text-xs break-all text-gray-400">
                {log.eventSignature}
              </span>
            )}
          </div>
        </div>

        {/* Info: (20260202 - Julian) Topics Section */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-sm font-medium text-gray-500">Topic</div>
          <div className="w-full space-y-3">
            {log.topics.map((topic, i) => {
              const param = i > 0 ? indexedParams[i - 1] : null;
              return (
                <div key={i} className="group flex items-start gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <span className="text-[10px] font-bold text-gray-300 transition-colors group-hover:text-gray-500">
                      {i}
                    </span>
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    {param && (
                      <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        {param.name}{' '}
                        <span className="font-normal text-gray-300 lowercase">({param.type})</span>
                      </span>
                    )}
                    <div className="w-full">
                      {renderValue(topic.value, `topic_${i}`, param?.type)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info: (20260202 - Julian) Data Section (Decoded Parameters or Raw Chunks) */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-sm font-medium text-gray-500">數據</div>
          <div className="w-full space-y-4 rounded-xl border border-gray-50 bg-gray-50/50 p-4">
            {log.decodedData && nonIndexedParams.length > 0 ? (
              nonIndexedParams.map((param, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {param.name}{' '}
                    <span className="font-normal text-gray-300 lowercase">({param.type})</span>
                  </span>
                  <div>{renderValue(param.value, `data_${param.name}`, param.type)}</div>
                </div>
              ))
            ) : dataChunks.length > 0 ? (
              dataChunks.map((chunk, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="grow">{renderValue(chunk, `data_chunk_${i}`)}</div>
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">無額外數據</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventLogs = ({ chainId, txId }: IEventLogsProps) => {
  const { executeBatch, isLoading, error: rpcError } = useEthRpc(chainId);
  const [eventLogs, setEventLogs] = useState<IProcessedLog[]>([]);
  const [searchAddr, setSearchAddr] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  useEffect(() => {
    const fetchLogsFlow = async () => {
      // Info: (20260202 - Julian) 階段 1: 取得收據 (Receipt) 以獲得 logs
      const response = await executeBatch([rpcService.getTransactionReceipt(txId)]);

      const receipt = response ? (response[0]?.result as IJsonRpcReceipt) : null;
      if (!receipt || !receipt.logs) return;

      // Info: (20260202 - Julian) 使用 IRpcLog 作為輸入，轉換為 IProcessedLog
      const processedLogs: IProcessedLog[] = receipt.logs.map((log: IJsonRpcLog, i) => {
        const decoded = decodeLog(log); // Info: (20260202 - Julian) 這裡會用到 ethers 或其他庫

        return {
          index: i,
          address: log.address,
          eventName: decoded?.name || 'Unknown',
          eventSignature: decoded?.signature || '',
          topics: log.topics.map((t, ti) => ({
            label: `topic_${ti}`,
            value: t,
          })),
          decodedData: decoded?.args || undefined, //? mapArgsToParams(decoded) : undefined,
          rawData: log.data,
        };
      });

      setEventLogs(processedLogs);
    };

    fetchLogsFlow();
  }, [txId, chainId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
        <div className="mb-6 flex animate-pulse items-center justify-between">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-10 w-64 rounded bg-gray-100" />
        </div>
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-6">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded bg-gray-100" />
              <div className="grow space-y-4">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                <div className="h-20 w-full animate-pulse rounded bg-gray-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rpcError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-md">
        <XCircle className="mb-4 text-red-500" size={48} />
        <h3 className="text-lg font-semibold text-gray-900">載入事件日誌失敗</h3>
        <p className="text-gray-500">{rpcError}</p>
      </div>
    );
  }

  const logs = eventLogs || [];
  const filteredLogs = logs.filter((log) => {
    const matchesAddr = log.address.toLowerCase().includes(searchAddr.toLowerCase());
    // Info: (20260202 - Julian) Event filter could be implemented if we had decoded names properly
    return matchesAddr;
  });

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-900 shadow-md">
      {/* Info: (20260202 - Julian) Header / Filter Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          共計 <span className="font-bold text-gray-900">{logs.length}</span> 個事件日誌
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pr-10 pl-4 text-sm font-medium transition-colors hover:border-gray-300 focus:ring-2 focus:ring-black/5 focus:outline-none"
            >
              <option value="all">事件: 全部</option>
              <option value="transfer">Transfer</option>
              <option value="approval">Approval</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="按地址搜索"
              value={searchAddr}
              onChange={(e) => setSearchAddr(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white pr-4 pl-10 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Info: (20260202 - Julian) Logs List */}
      <div className="divide-y divide-gray-50">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, i) => <LogItem key={i} log={log} index={i} chainId={chainId} />)
        ) : (
          <div className="py-20 text-center text-gray-400">沒有符合條件的事件日誌</div>
        )}
      </div>
    </div>
  );
};

export default EventLogs;
