export interface IRpcBody {
  jsonrpc: string;
  method: string;
  params: unknown[];
  id: number;
}

export const rpcService = {
  // Info: (20260130 - Julian) 1. 取得地址發出的交易總數 (Nonce)
  getTransactionCount: (address: string, blockTag: string = 'latest'): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [address, blockTag],
    id: Date.now(),
  }),

  // Info: (20260130 - Julian) 2. 取得地址餘額
  getBalance: (address: string, blockTag: string = 'latest'): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, blockTag],
    id: Date.now() + 1,
  }),

  // Info: (20260130 - Julian) 3. 取得交易收據 (含執行結果與消耗 Gas)
  getTransactionReceipt: (txHash: string): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionReceipt',
    params: [txHash],
    id: Date.now() + 2,
  }),

  // Info: (20260130 - Julian) 4. 取得交易基礎資訊 (含 Input Data, Value)
  getTransactionByHash: (txHash: string): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [txHash],
    id: Date.now() + 3,
  }),

  // Info: (20260130 - Julian) 5. 取得區塊內容 (可指定是否包含完整交易物件)
  getBlockByNumber: (blockNumber: string, fullTx: boolean = true): IRpcBody => {
    // Info: (20260130 - Julian) 將 blockNumber 轉換為十六進制
    const formattedBlockNumber = blockNumber.startsWith('0x')
      ? blockNumber
      : `0x${BigInt(blockNumber).toString(16)}`;
    return {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [formattedBlockNumber, fullTx], // Info: (20260130 - Julian) 將 blockNumber 轉換為十六進制
      id: Date.now() + 4,
    };
  },

  // Info: (20260130 - Julian) 6. 透過區塊雜湊與索引取得交易
  getTransactionByBlockHashAndIndex: (blockHash: string, indexHex: string): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByBlockHashAndIndex',
    params: [blockHash, indexHex],
    id: Date.now() + 5,
  }),

  // Info: (20260130 - Julian) 7. 取得當前最新區塊高度
  getBlockNumber: (): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: Date.now() + 6,
  }),

  // Info: (20260130 - Julian) 8. 透過區塊雜湊取得區塊內容
  getBlockByHash: (blockHash: string, fullTx: boolean = true): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: [blockHash, fullTx],
    id: Date.now() + 7,
  }),

  /**
   * Info: (20260203 - Julian) 9. 取得 ERC-20 代幣餘額的請求物件
   * @param tokenAddress 代幣合約地址
   * @param userAddress 要查詢的用戶地址
   */
  getErc20Balance: (tokenAddress: string, userAddress: string): IRpcBody => {
    // Info: (20260203 - Julian) 移除 0x 並補足至 64 字元 (32 bytes)
    const cleanAddress = userAddress.startsWith('0x') ? userAddress.slice(2) : userAddress;
    const paddedAddress = cleanAddress.padStart(64, '0');

    // Info: (20260203 - Julian) balanceOf 的 Method ID 是 0x70a08231
    const data = `0x70a08231${paddedAddress}`;

    return {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: data,
        },
        'latest',
      ],
      id: Date.now() + 8,
    };
  },

  // Info: (20260203 - Julian) 10. 取得代幣符號 (如 WETH)
  getErc20Symbol: (tokenAddress: string): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [{ to: tokenAddress, data: '0x95d89b41' }, 'latest'], // 0x95d89b41 是 symbol() 的 selector
    id: Date.now() + 9,
  }),

  // Info: (20260203 - Julian) 11. 取得代幣精度 (如 18)
  getErc20Decimals: (tokenAddress: string): IRpcBody => ({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [{ to: tokenAddress, data: '0x313ce567' }, 'latest'], // Info: (20260203 - Julian) 0x313ce567 是 decimals() 的 selector
    id: Date.now() + 10,
  }),
};
