'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, FileText, Cpu, Zap, Flame, LucideIcon, Loader2 } from 'lucide-react';
import { IJsonRpcResponse, IJsonRpcBlock } from '@/interfaces/rpc';
import { fetchApi } from '@/lib/services/api_service';
import {
  formatHexToDecimal,
  formatTimestamp,
  formatFullTimestamp,
  formatHexToEther,
  formatHexToGwei,
} from '@/lib/utils/format';
import CopyButton from '@/components/common/copy_button';
import BlockDetailHeader, { BlockDetailTabType } from '@/components/block/block_detail_header';

interface IBlockDetailsPageProps {
  params: Promise<{
    chainId: string;
    blockId: string; // height or hash
  }>;
}

const DetailItem = ({
  label,
  children,
  icon: Icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: LucideIcon;
}) => (
  <div className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-12">
    <div className="flex w-full items-center gap-1.5 text-sm text-gray-500 sm:w-1/4">
      {Icon && <Icon size={14} className="text-gray-400" />}
      {label} :
    </div>
    <div className="flex-1 text-sm text-gray-900">{children}</div>
  </div>
);

export default function BlockDetailsPage(props: IBlockDetailsPageProps) {
  const params = use(props.params);
  const { chainId, blockId } = params;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [block, setBlock] = useState<IJsonRpcBlock | null>(null);
  const [latestBlockNumber, setLatestBlockNumber] = useState<string | null>(null);
  const [parentBlockNumber, setParentBlockNumber] = useState<string | null>(null);

  // parent block url
  const parentBlockUrl = parentBlockNumber ? `/chain/${chainId}/blocks/${parentBlockNumber}` : '#';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `/api/v1/chains/${chainId}`;

        // 1. Fetch Latest Block Number (for confirmations)
        const latestRes = await fetchApi<IJsonRpcResponse<string>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });
        if (latestRes.result) {
          setLatestBlockNumber(latestRes.result);
        }

        // 2. Fetch Block
        // If blockId starts with 0x and is 66 chars, it's a hash.
        // Otherwise, it's a height. Note: some height might be 0x.
        const isHash = blockId.startsWith('0x') && blockId.length === 66;
        const method = isHash ? 'eth_getBlockByHash' : 'eth_getBlockByNumber';
        let blockParam = blockId;
        if (!isHash) {
          // If it's a number string, convert to hex if it doesn't have 0x
          if (!blockId.startsWith('0x')) {
            blockParam = `0x${BigInt(blockId).toString(16)}`;
          }
        }

        const blockRes = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: [blockParam, false], // false to not get full transactions
            id: 2,
          }),
        });

        if (blockRes.result) {
          setBlock(blockRes.result);

          // get parent block number
          const parentRes = await fetchApi<IJsonRpcResponse<IJsonRpcBlock>>(url, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByHash',
              params: [blockRes.result.parentHash, false],
              id: 3,
            }),
          });
          if (parentRes.result) {
            setParentBlockNumber(parentRes.result.number);
          }
        } else {
          setError('Block not found');
        }
      } catch (err: unknown) {
        console.error('Failed to fetch block details:', err);
        setError('Failed to fetch block details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chainId, blockId]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">{error || 'Block not found'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-[#5841D8] hover:underline"
        >
          返回上一頁
        </button>
      </div>
    );
  }

  const blockNumber = BigInt(block.number);
  const confirmations = latestBlockNumber ? BigInt(latestBlockNumber) - blockNumber + 1n : null;
  const gasUsed = BigInt(block.gasUsed);
  const gasLimit = BigInt(block.gasLimit);
  const gasPercent = Number((gasUsed * 10000n) / gasLimit) / 100;

  // Base Fee
  const baseFeeWei = block.baseFeePerGas ? BigInt(block.baseFeePerGas) : 0n;
  const burntFeeWei = baseFeeWei * gasUsed;
  const burntFeeEth = formatHexToEther(`0x${burntFeeWei.toString(16)}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <BlockDetailHeader
          chainId={chainId}
          blockId={blockId}
          blockNumber={blockNumber}
          activeTab={BlockDetailTabType.OVERVIEW}
        />

        {/* Overview Tab Content */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="divide-y divide-gray-100">
            <div>
              <DetailItem label="區塊哈希">
                <div className="flex items-center gap-2 font-mono leading-relaxed break-all">
                  {block.hash}
                  <CopyButton value={block.hash} />
                </div>
              </DetailItem>

              <DetailItem label="確認數">
                <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                  {confirmations?.toLocaleString() ?? '-'}
                </span>
              </DetailItem>

              <DetailItem label="時間" icon={Clock}>
                <div className="flex items-center gap-2">
                  <span>{formatFullTimestamp(block.timestamp)}</span>
                  <span className="text-xs text-gray-500">
                    ({formatTimestamp(block.timestamp)})
                  </span>
                </div>
              </DetailItem>

              <DetailItem label="交易數量" icon={FileText}>
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                  <span>區塊內包含</span>
                  <Link
                    href={`/chain/${chainId}/blocks/${blockId}/tx`}
                    className="font-bold text-[#5841D8] hover:underline"
                  >
                    {Array.isArray(block.transactions) ? block.transactions.length : 0} 筆交易
                  </Link>
                  {/* Internal txs, etc. would normally require more specific API calls, here as placeholders or mock if not available */}
                  <span className="text-gray-400">
                    及 0 筆內部交易 及 0 筆代幣轉帳 及 0 筆 NFT 轉帳
                  </span>
                </div>
              </DetailItem>

              <DetailItem label="解押交易">
                <div className="flex items-center gap-1 font-bold text-[#5841D8]">
                  {block.withdrawals?.length ?? 0} 個解押交易
                </div>
              </DetailItem>
            </div>

            <div>
              <DetailItem label="驗證者">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/chain/${chainId}/address/${block.miner}`}
                    className="font-mono text-[#5841D8] hover:underline"
                  >
                    {block.miner}
                  </Link>
                  <CopyButton value={block.miner} />
                </div>
              </DetailItem>

              <DetailItem label="區塊獎勵">
                <div className="flex items-center gap-1 font-bold">
                  0.00 ETH{' '}
                  <span className="text-xs font-normal text-gray-400">(0 ETH + 0 ETH - 0 ETH)</span>
                </div>
              </DetailItem>

              <DetailItem label="總難度">
                <span className="text-gray-400">--</span>
              </DetailItem>

              <DetailItem label="區塊大小">
                <span>{formatHexToDecimal(block.size).toLocaleString()} bytes</span>
              </DetailItem>
            </div>

            <div>
              <DetailItem label="Gas 消耗" icon={Cpu}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{gasUsed.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">({gasPercent.toFixed(2)}%)</span>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Zap size={12} fill="currentColor" /> 91.38% Gas 目標
                    </div>
                  </div>
                  <div className="h-1.5 w-64 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-gray-400"
                      style={{ width: `${Math.min(gasPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </DetailItem>

              <DetailItem label="Gas 限額">
                <span>{gasLimit.toLocaleString()}</span>
              </DetailItem>

              <DetailItem label="Gas 均價">
                <div className="flex items-center gap-2">
                  <span className="font-bold">0.00 ETH</span>
                  <span className="text-xs text-gray-500"> (0 Mwei)</span>
                </div>
              </DetailItem>

              <DetailItem label="每 Gas 基礎費">
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {formatHexToEther(block.baseFeePerGas || '0x0')} ETH
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatHexToGwei(block.baseFeePerGas || '0x0')} Mwei)
                  </span>
                </div>
              </DetailItem>

              <DetailItem label="銷毀手續費" icon={Flame}>
                <div className="flex items-center gap-1 font-bold text-orange-600">
                  🔥 {burntFeeEth} ETH
                </div>
              </DetailItem>

              <DetailItem label="額外數據">
                <div className="rounded bg-gray-50 p-2 font-mono text-xs leading-normal break-all text-gray-600">
                  {block.extraData}
                </div>
              </DetailItem>
            </div>

            <div>
              <DetailItem label="Blob 交易">
                <span className="font-bold text-[#5841D8]">0 個 Blob 交易</span>
              </DetailItem>

              <DetailItem label="總 Blob 大小">
                <span>0 KiB</span>
              </DetailItem>
            </div>

            {/* ... more blob fields if needed, but keeping it simple as per most blocks */}

            <div>
              <DetailItem label="父區塊哈希">
                <Link
                  href={parentBlockUrl}
                  className="font-mono break-all text-[#5841D8] hover:underline"
                >
                  {block.parentHash}
                </Link>
              </DetailItem>

              <DetailItem label="狀態根">
                <span className="font-mono break-all text-gray-600">{block.stateRoot}</span>
              </DetailItem>

              <DetailItem label="提款根">
                <span className="font-mono break-all text-gray-600">
                  {block.withdrawalsRoot || '--'}
                </span>
              </DetailItem>

              <DetailItem label="Nonce">
                <span className="font-mono text-gray-600">{formatHexToDecimal(block.nonce)}</span>
              </DetailItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
