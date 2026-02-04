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

// 本地快取：記錄已解析成功的事件
const localCache: Record<string, { name: string; signature: string; iface: Interface }> = {};

/**
 * 整合型 Log 解析器 (支援 4Byte 與 Cache)
 */
export const decodeLog = async (topics: string[], data: string): Promise<LogDescription | null> => {
  const topic0 = topics[0];
  if (!topic0) return null; // 檢查 topic0 是否存在

  // --- 策略 A: 檢查本地快取 ---
  if (localCache[topic0] && localCache[topic0].iface) {
    try {
      const decoded = localCache[topic0].iface.parseLog({ topics, data });
      if (decoded) return decoded;
    } catch {
      console.warn('快取解析失敗，嘗試重新解析');
      delete localCache[topic0]; // 清除壞掉的快取
    }
  }

  // --- 策略 B: 使用 COMMON_ABI 嘗試解析 ---
  try {
    const basicDecoded = iface.parseLog({ topics, data });
    if (basicDecoded) {
      // 解析成功後，存入快取供下次使用
      localCache[topic0] = {
        name: basicDecoded.name,
        signature: basicDecoded.signature,
        iface: new Interface([basicDecoded.fragment.format()]),
      };
      return basicDecoded;
    }
  } catch {
    console.warn('COMMON_ABI 解析失敗');
  }

  // --- 策略 C: 請求 4Byte Directory API ---
  try {
    const response = await fetch(
      `https://www.4byte.directory/api/v1/event-signatures/?hex_signature=${topic0}`
    );
    const result = await response.json();

    // 檢查是否有結果
    if (result.results && result.results.length > 0) {
      // 取得簽名字串，例如 "Transfer(address,address,uint256)"
      const signature = result.results[0].text_signature;
      const cleanSignature = `event ${signature}`; // 補上 event 關鍵字給 ethers 使用

      // 注意：這裡也需要 try-catch，因為 topics 數量如果不對會報錯
      try {
        const dynamicIface = new Interface([cleanSignature]);
        const decoded = dynamicIface.parseLog({ topics, data });
        if (decoded) {
          // 成功解析後，永續快取
          localCache[topic0] = {
            name: decoded.name,
            signature: decoded.signature,
            iface: dynamicIface,
          };
          return decoded;
        }
      } catch {
        // 如果 parseLog 失敗（通常是 indexed 數量不對），至少回傳事件名稱
        return {
          name: signature.split('(')[0],
          signature,
          fragment: { name: signature.split('(')[0], inputs: [] },
          args: [],
        } as unknown as LogDescription;
      }
    } else {
      // --- 重點：API 查無結果時的保底 ---
      return {
        name: `Method ${topic0.slice(0, 10)}`, // 顯示前幾個字元
        signature: topic0,
        fragment: { name: 'Unknown', inputs: [] },
        args: [],
      } as unknown as LogDescription;
    }
  } catch (err) {
    console.warn('4Byte 查詢失敗:', err);
  }

  return null; // 全部失敗
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
