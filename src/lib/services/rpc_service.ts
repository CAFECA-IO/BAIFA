export const rpcService = {
  // 1. 取得地址發出的交易總數 (Nonce)
  getTransactionCount: (address: string, blockTag: string = 'latest') => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [address, blockTag],
    id: Date.now(),
  }),

  // 2. 取得地址餘額
  getBalance: (address: string, blockTag: string = 'latest') => ({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, blockTag],
    id: Date.now() + 1,
  }),

  // 3. 取得交易收據 (含執行結果與消耗 Gas)
  getTransactionReceipt: (txHash: string) => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionReceipt',
    params: [txHash],
    id: Date.now() + 2,
  }),

  // 4. 取得交易基礎資訊 (含 Input Data, Value)
  getTransactionByHash: (txHash: string) => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [txHash],
    id: Date.now() + 3,
  }),

  // 5. 取得區塊內容 (可指定是否包含完整交易物件)
  getBlockByNumber: (blockNumber: string, fullTx: boolean = true) => {
    // 將 blockNumber 轉換為十六進制
    const formattedBlockNumber = blockNumber.startsWith('0x')
      ? blockNumber
      : `0x${BigInt(blockNumber).toString(16)}`;
    return {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [formattedBlockNumber, fullTx], // 將 blockNumber 轉換為十六進制
      id: Date.now() + 4,
    };
  },

  // 6. 透過區塊哈希與索引取得交易
  getTransactionByBlockHashAndIndex: (blockHash: string, indexHex: string) => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByBlockHashAndIndex',
    params: [blockHash, indexHex],
    id: Date.now() + 5,
  }),

  // 7. 取得當前最新區塊高度
  getBlockNumber: () => ({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: Date.now() + 6,
  }),

  // 8. 透過區塊哈希取得區塊內容
  getBlockByHash: (blockHash: string, fullTx: boolean = true) => ({
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: [blockHash, fullTx],
    id: Date.now() + 7,
  }),
};
