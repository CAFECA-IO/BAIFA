import { formatEther, formatGwei } from 'viem';
import { IJsonRpcBlock, IJsonRpcTransaction } from '@/interfaces/rpc';
import { IBlock } from '@/interfaces/chain';

function ensureHexPrefix(hex: string): string {
  if (typeof hex !== 'string') return hex;
  if (hex.startsWith('0x')) return hex;
  /**
   * Info: (20260130 - Julian) If it contains hex characters or we specifically expect hex, add 0x
   * For safety in these formatters, we assume if it's not starting with 0x, it might be a hex string from toString(16)
   */
  return `0x${hex}`;
}

export function formatHexToDecimal(hex: string): string {
  if (!hex) return '0';
  return BigInt(ensureHexPrefix(hex)).toString();
}

export function formatHexToEther(hex: string): string {
  if (!hex) return '0';
  return formatEther(BigInt(ensureHexPrefix(hex)));
}

export function formatHexToGwei(hex: string, decimals = 2): string {
  if (!hex) return '0';
  const gwei = formatGwei(BigInt(ensureHexPrefix(hex)));
  return parseFloat(gwei).toFixed(decimals);
}

export function formatTimestamp(timestamp: string): string {
  if (!timestamp) return '';
  const date = new Date(Number(BigInt(ensureHexPrefix(timestamp))) * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} 秒前`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} 分鐘前`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} 小時前`;
  }
  return date.toLocaleDateString();
}

export function formatFullTimestamp(timestamp: string): string {
  if (!timestamp) return '';
  const date = new Date(Number(BigInt(ensureHexPrefix(timestamp))) * 1000);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatHexToMwei(hex: string, decimals = 2): string {
  if (!hex) return '0';
  const gwei = formatGwei(BigInt(ensureHexPrefix(hex)));
  const mwei = parseFloat(gwei) * 1000;
  return mwei.toFixed(decimals);
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * 將 RPC 回傳的原始 Block 資料轉換為 UI 顯示用的介面
 */
export const formatRpcBlock = (block: IJsonRpcBlock): IBlock => {
  const gasUsed = BigInt(block.gasUsed);
  const gasLimit = BigInt(block.gasLimit);

  // 1. 計算該區塊的總手續費 (Total Gas Fee)
  let totalFee = 0n;
  if (Array.isArray(block.transactions) && typeof block.transactions[0] !== 'string') {
    totalFee = (block.transactions as IJsonRpcTransaction[]).reduce((acc, tx) => {
      // 這裡簡單使用 gasPrice * gas，精確做法應配合 Receipt 的 gasUsed
      return acc + BigInt(tx.gasPrice) * BigInt(tx.gas);
    }, 0n);
  }

  // 2. 計算平均 Gas Price (Gwei)
  const avgGasPrice = gasUsed > 0n ? Number(totalFee / gasUsed) / 1e9 : 0;

  // 3. 組合區塊獎勵 (Block Reward)
  // 在 PoS 之後，區塊獎勵主要是手續費與小費，此處以總手續費估算
  const blockReward = Number(totalFee) / 1e18;

  // 計算 Gas 使用百分比 (精確到小數點後兩位)
  const percent = gasLimit > 0n ? Number((gasUsed * 10000n) / gasLimit) / 100 : 0;

  // 計算距離現在多久
  const diff = Math.floor((Date.now() - Number(block.timestamp) * 1000) / 1000);
  const timeAgo = diff < 60 ? `${diff}s ago` : `${Math.floor(diff / 60)}m ${diff % 60}s ago`;

  return {
    height: BigInt(block.number).toString(),
    time: timeAgo,
    timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
    proposer: block.miner,
    txns: Array.isArray(block.transactions) ? block.transactions.length : 0,
    size: BigInt(block.size).toString(),
    reward: blockReward.toFixed(6), // 區塊獎勵 (ETH)
    gas: (Number(totalFee) / 1e18).toFixed(6), // 總手續費 (ETH)
    gasPrice: avgGasPrice.toFixed(2), // 平均 Gas Price (Gwei)
    gasUsed: gasUsed.toString(),
    gasUsedPercent: percent,
    gasLimit: gasLimit.toString(),
  };
};

/**
 * 輔助方法：將 Hex 轉換為 Ether 字串 (例如顯示於數量欄位)
 */
export const hexToEther = (hex: string): string => {
  const val = BigInt(hex);
  return (Number(val) / 1e18).toFixed(4); // 簡單示範，實際可用 ethers.formatEther
};
