export interface IJsonRpcResponse<T> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: {
    code: number;
    message: string;
  };
}

export interface IJsonRpcBlock {
  number: string;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionsRoot: string;
  stateRoot: string;
  miner: string;
  difficulty: string;
  totalDifficulty: string;
  extraData: string;
  size: string;
  gasLimit: string;
  gasUsed: string;
  timestamp: string;
  transactions: string[] | IJsonRpcTransaction[];
  uncles: string[];
  baseFeePerGas?: string;
}

export interface IJsonRpcTransaction {
  hash: string;
  nonce: string;
  blockHash: string;
  blockNumber: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
}
