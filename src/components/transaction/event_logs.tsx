'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, ExternalLink } from 'lucide-react';
import { IJsonRpcReceipt } from '@/interfaces/rpc';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import { rpcService } from '@/lib/services/rpc_service';
import CopyButton from '@/components/common/copy_button';
import ErrorState from '@/components/common/error_state';
import { decodeLog } from '@/lib/utils/log_parser';
import HexLine from '@/components/common/hex_line';

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
  const [displayModes, setDisplayModes] = useState<Record<string, 'Dec' | 'Hex'>>({});

  // Info: (20260203 - Julian) 根據 key 切換顯示模式
  const toggleMode = (key: string) => {
    setDisplayModes((prev) => ({
      ...prev,
      [key]: prev[key] === 'Hex' ? 'Dec' : 'Hex',
    }));
  };

  const renderValue = useCallback(
    (val: string, paramKey: string, paramType?: string) => {
      if (!val || val === '0x') return <span className="text-gray-400 italic">0x</span>;

      // 辨識地址：包含標準 address 與 32-byte 填充地址
      const isAddress =
        paramType === 'address' ||
        (val.length === 66 && val.startsWith('0x000000000000000000000000'));
      const cleanAddress = isAddress ? (val.length === 66 ? '0x' + val.slice(26) : val) : null;

      const addressPath = `/chain/${chainId}/address/${cleanAddress}`;

      if (cleanAddress) {
        return (
          <div className="flex items-center gap-2">
            <Link
              href={addressPath}
              className="font-mono text-sm break-all text-blue-600 hover:text-blue-800 hover:underline"
            >
              {cleanAddress}
            </Link>
            <CopyButton value={cleanAddress} />
          </div>
        );
      }

      const mode = displayModes[paramKey] || 'Dec';

      // 安全地處理 BigInt 轉換
      let displayText = val;
      let hasDec = false;
      try {
        if (val.startsWith('0x') && val.length > 2) {
          displayText = mode === 'Dec' ? BigInt(val).toString() : val;
          hasDec = true;
        }
      } catch {
        displayText = val;
      }

      return (
        <div className="flex items-center gap-2 overflow-hidden">
          {hasDec && (
            <div className="flex shrink-0 overflow-hidden rounded border border-gray-200 text-[10px]">
              <button
                type="button"
                onClick={() => toggleMode(paramKey)}
                className={`px-1.5 py-0.5 transition-colors ${mode === 'Dec' ? 'bg-gray-100 font-bold text-gray-900' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
              >
                Dec
              </button>
              <button
                type="button"
                onClick={() => toggleMode(paramKey)}
                className={`px-1.5 py-0.5 transition-colors ${mode === 'Hex' ? 'bg-gray-100 font-bold text-gray-900' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
              >
                Hex
              </button>
            </div>
          )}
          <span className="font-mono text-sm break-all text-gray-700">{displayText}</span>
        </div>
      );
    },
    [chainId, displayModes]
  );

  const nonIndexedParams = useMemo(
    () => log.decodedData?.filter((p) => !p.isIndexed) || [],
    [log.decodedData]
  );

  const dataChunks = useMemo(() => {
    if (log.decodedData && log.decodedData.length > 0) return [];
    if (!log.rawData || log.rawData === '0x') return [];
    return (log.rawData.slice(2).match(/.{1,64}/g) || []).map((s) => '0x' + s);
  }, [log.decodedData, log.rawData]);

  const displayedTopics = log.topics.map((topic, i) => (
    <div key={i} className="flex gap-4">
      <span className="w-4 pt-1.5 text-[10px] font-black text-gray-300">{i}</span>
      <div className="min-w-0 grow space-y-1.5">
        <div className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
          {topic.label}
        </div>
        {renderValue(topic.value, `topic_${index}_${i}`)}
      </div>
    </div>
  ));

  return (
    <div className="flex gap-6 border-b border-gray-100 py-8 last:border-0">
      {/* Info: (20260203 - Julian) 顯示 Log 的序號 */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-gray-100 bg-gray-50 text-sm font-bold text-gray-400">
        {index}
      </div>

      <div className="min-w-0 grow space-y-6">
        {/* Info: (20260203 - Julian) 地址欄 */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
            合約地址
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/chain/${chainId}/address/${log.address}`}
                className="font-mono text-sm text-blue-600 hover:underline"
              >
                {log.address}
              </Link>
              <CopyButton value={log.address} size={14} />
            </div>
            {log.addressTag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                <ExternalLink size={10} /> {log.addressTag}
              </span>
            )}
          </div>
        </div>

        {/* 事件特徵 */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
            事件日誌
          </div>
          <div className="min-w-0 grow space-y-2">
            <div className="text-base font-bold text-gray-900">{log.eventName}</div>
            {log.eventSignature && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 font-mono text-[11px] leading-relaxed break-all text-gray-500">
                {log.eventSignature}
              </div>
            )}
          </div>
        </div>

        {/* Info: (20260203 - Julian) Topics 區塊 */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Topics
          </div>
          <div className="grow space-y-4">{displayedTopics}</div>
        </div>

        {/* 數據內容 */}
        <div className="flex items-start gap-4">
          <div className="w-24 shrink-0 pt-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
            數據內容
          </div>
          <div className="grow space-y-5 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4">
            {nonIndexedParams.length > 0 ? (
              nonIndexedParams.map((p, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                    {p.name} <span className="font-normal lowercase opacity-70">({p.type})</span>
                  </div>
                  {renderValue(p.value, `data_${index}_${i}`, p.type)}
                </div>
              ))
            ) : dataChunks.length > 0 ? (
              <div className="space-y-1 font-mono">
                {dataChunks.map((chunk, i) => (
                  <HexLine
                    key={i}
                    chunk={chunk}
                    index={i}
                    renderValue={(val: string) => renderValue(val, `chunk_${index}_${i}`)}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">無額外數據內容</span>
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
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    const fetchLogsFlow = async () => {
      const response = await executeBatch([rpcService.getTransactionReceipt(txId)]);
      const receipt = response?.[0]?.result as IJsonRpcReceipt | undefined;

      if (!receipt?.logs) return;

      const processed: IProcessedLog[] = receipt.logs.map((log, i) => {
        const decoded = decodeLog(log.topics, log.data);

        const topics = log.topics.map((t, ti) => ({
          label:
            ti === 0
              ? 'Signature Hash'
              : decoded?.fragment.inputs.filter((input) => input.indexed)[ti - 1]?.name ||
                `topic [${ti}]`,
          value: t,
        }));

        const decodedData = decoded?.args
          ? decoded.fragment.inputs.map((input) => ({
              name: input.name,
              type: input.type,
              value: decoded.args[input.name]?.toString() || '0x',
              isIndexed: !!input.indexed, // 使用 !! 將 boolean | null 強制轉為 boolean
            }))
          : [];

        return {
          index: i,
          address: log.address,
          eventName: decoded?.name || 'Unknown',
          eventSignature: decoded?.signature || '',
          topics,
          decodedData,
          rawData: log.data,
        };
      });

      setEventLogs(processed);
    };

    fetchLogsFlow();
  }, [txId, chainId, executeBatch]);

  const filteredLogs = useMemo(() => {
    return eventLogs.filter(
      (log) =>
        log.address.toLowerCase().includes(searchInput.toLowerCase()) ||
        log.eventName.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [eventLogs, searchInput]);

  if (isLoading)
    return <div className="animate-pulse p-8 text-center text-gray-400">正在載入事件日誌...</div>;
  if (rpcError) return <ErrorState title="載入失敗" message={rpcError} showContainer />;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">事件日誌</h3>
          <p className="text-sm text-gray-500">共計 {eventLogs.length} 個事件</p>
        </div>

        <div className="group relative">
          <Search
            size={20}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500"
          />
          <input
            type="text"
            placeholder="搜尋地址或事件..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-96 rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-base text-blue-500 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, i) => <LogItem key={i} log={log} index={i} chainId={chainId} />)
        ) : (
          <div className="py-20 text-center text-gray-400">查無相符的事件日誌</div>
        )}
      </div>
    </div>
  );
};

export default EventLogs;
