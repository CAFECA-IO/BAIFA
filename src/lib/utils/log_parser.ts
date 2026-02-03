import { Interface, LogDescription, formatUnits } from 'ethers';
import { IJsonRpcLog } from '@/interfaces/rpc';

// Info: (20260203 - Julian) 定義常見的 ABI 介面
const COMMON_ABI = [
  // Info: (20260203 - Julian) ERC-20 & ERC-721
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',

  // Info: (20260203 - Julian) WETH 專用
  'event Deposit(address indexed dst, uint256 wad)',
  'event Withdrawal(address indexed src, uint256 wad)',

  // Info: (20260203 - Julian) Uniswap V3
  'event Initialize(uint160 sqrtPriceX96, int24 tick)',
  'event IncreaseCardinalityNext(uint16 oldCardinalityNext, uint16 newCardinalityNext)',
  'event ProtocolFeesUpdated(uint16 feeProtocol0, uint16 feeProtocol1)',
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  'event Swap(address indexed sender, address indexed recipient, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  'event Mint(address sender, address indexed owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Burn(address indexed owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Collect(address indexed owner, address recipient, int24 tickLower, int24 tickUpper, uint128 amount0, uint128 amount1)',

  // Info: (20260203 - Julian) Uniswap V4
  'event Swap(address indexed sender, address indexed recipient, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint24 fee)',
];
const iface = new Interface(COMMON_ABI);

// Info: (20260203 - Julian) 自動解析 Log
export const decodeLog = (topics: string[], data: string): LogDescription | null => {
  try {
    // Info: (20260203 - Julian) ethers 會自動根據 topics[0] 匹配事件定義
    return iface.parseLog({ topics, data });
  } catch {
    // Info: (20260203 - Julian) 如果不匹配任何已知 ABI，則回傳空
    return null;
  }
};

/**
 * Info: (20260203 - Julian)
 * @param rawAmount RPC 回傳的 Hex 字串或 BigInt (如 0xde0b6b3a7640000)
 * @param decimals 代幣的精度 (如 18)
 */
export const formatTokenAmount = (rawAmount: string | bigint, decimals: number = 18): string => {
  try {
    // Info: (20260203 - Julian) formatUnits 會自動處理除法並回傳字串
    return formatUnits(rawAmount, decimals);
  } catch {
    return '0';
  }
};

/**
 * Info: (20260203 - Julian)
 * 解析 RPC eth_call 回傳的 ABI 編碼字串 (用於 symbol, name)
 * @param hex RPC 回傳的 0x 開頭長字串
 */
export const parseRpcString = (hex: string | undefined): string => {
  if (
    !hex ||
    hex === '0x' ||
    hex === '0x0000000000000000000000000000000000000000000000000000000000000000'
  ) {
    return '';
  }

  try {
    // Info: (20260203 - Julian) 1. 移除 0x 前綴
    const data = hex.startsWith('0x') ? hex.slice(2) : hex;

    /**
     * Info: (20260203 - Julian) ABI String 編碼結構：
     * [0-63]    - 數據起始位置偏移量 (通常是 0x20)
     * [64-127]  - 字串實際長度 (以 bytes 為單位)
     * [128...]  - UTF-8 編碼內容
     */

    // Info: (20260203 - Julian) 2. 取得長度 (位於第 2 個 32-byte 區塊)
    const lengthHex = data.slice(64, 128);
    const length = parseInt(lengthHex, 16);

    /**
     * Info: (20260203 - Julian) 3. 根據長度截取內容 (從第 3 個 32-byte 區塊開始)
     * 一個 byte 對應兩個 hex 字元，所以從 index 128 開始往後切 length * 2
     */
    const contentHex = data.slice(128, 128 + length * 2);

    // Info: (20260203 - Julian) 4. 將 Hex 轉回 UTF-8 字串
    const bytes = new Uint8Array(
      contentHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    return new TextDecoder().decode(bytes).replace(/\0/g, ''); // Info: (20260203 - Julian) 移除可能的空字元
  } catch (error) {
    console.error('解析 RPC 字串失敗:', error);
    return 'Unknown';
  }
};

// Info: (20260203 - Julian) 解析 Logs 並過濾出 ERC20 Transfer
export const extractRawTransfers = (logs: IJsonRpcLog[]) => {
  // Info: (20260203 - Julian) ERC20 Transfer 事件的 Topic 0
  const TRANSFER_TOPIC = '0xddf252ad1be2c89b6c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

  return logs
    .filter(
      (log) => log.topics[0] === TRANSFER_TOPIC && log.topics.length === 3 // Info: (20260203 - Julian) 標準 ERC20 Transfer 會有 3 個 Topic (Event, From, To)
    )
    .map((log) => ({
      tokenAddress: log.address,
      from: `0x${log.topics[1].slice(26)}`, // Info: (20260203 - Julian) 移除補零的部分，還原為 20 bytes 地址
      to: `0x${log.topics[2].slice(26)}`,
      value: log.data, // Info: (20260203 - Julian) 這是十六進位的金額
    }));
};
