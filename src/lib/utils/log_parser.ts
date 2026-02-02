import { Interface } from 'ethers';
import { IJsonRpcLog } from '@/interfaces/rpc';

// 預定義常見合約介面 (如 ERC-20, Uniswap V3/V4)
const COMMON_INTERFACES = [
  new Interface(['event Transfer(address indexed src, address indexed dst, uint256 wad)']),
  new Interface(['event Deposit(address indexed dst, uint256 wad)']),
  // ... 這裡放入 Uniswap V4 的 Swap 事件 ABI
];

export const decodeLog = (log: IJsonRpcLog) => {
  for (const iface of COMMON_INTERFACES) {
    try {
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }
  return null; // 無法解析則回傳原始資料
};
