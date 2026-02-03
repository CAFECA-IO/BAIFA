import { Interface, LogDescription, formatUnits } from 'ethers';

// 定義常見的 ABI 介面
const COMMON_ABI = [
  // ERC-20 & ERC-721
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',

  // WETH
  'event Deposit(address indexed dst, uint256 wad)',
  'event Withdrawal(address indexed src, uint256 wad)',

  // Uniswap V3
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  'event Mint(address sender, address indexed owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Burn(address indexed owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Collect(address indexed owner, address recipient, int24 tickLower, int24 tickUpper, uint128 amount0, uint128 amount1)',

  // Uniswap V4
  'event Swap(address indexed sender, address indexed recipient, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint24 fee)',
];
const iface = new Interface(COMMON_ABI);

/**
 * 自動解析 Log
 */
export const decodeLog = (topics: string[], data: string): LogDescription | null => {
  try {
    // ethers 會自動根據 topics[0] 匹配事件定義
    return iface.parseLog({ topics, data });
  } catch {
    // 如果不匹配任何已知 ABI，則回傳空
    return null;
  }
};

/**
 * @param rawAmount RPC 回傳的 Hex 字串或 BigInt (如 0xde0b6b3a7640000)
 * @param decimals 代幣的精度 (如 18)
 */
export const formatTokenAmount = (rawAmount: string | bigint, decimals: number = 18): string => {
  try {
    // formatUnits 會自動處理除法並回傳字串
    return formatUnits(rawAmount, decimals);
  } catch {
    return '0';
  }
};
