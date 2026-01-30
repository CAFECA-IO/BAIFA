import { formatEther, formatGwei } from 'viem';

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
