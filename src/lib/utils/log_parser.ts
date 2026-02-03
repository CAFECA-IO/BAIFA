import { Interface, LogDescription } from 'ethers';

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

  // Uniswap V4 (如果這是你的重點)
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
