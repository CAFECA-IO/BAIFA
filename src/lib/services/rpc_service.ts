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
  getBlockByNumber: (blockNumber: string, fullTx: boolean = true) => ({
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: [blockNumber, fullTx],
    id: Date.now() + 4,
  }),

  // 6. 透過區塊哈希與索引取得交易
  getTransactionByBlockHashAndIndex: (blockHash: string, indexHex: string) => ({
    jsonrpc: '2.0',
    method: 'eth_getTransactionByBlockHashAndIndex',
    params: [blockHash, indexHex],
    id: Date.now() + 5,
  }),
};
