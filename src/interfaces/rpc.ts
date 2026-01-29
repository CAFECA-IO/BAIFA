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
  baseFeePerGas?: string;
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  totalDifficulty: string;
  transactions: string[] | IJsonRpcTransaction[];
  transactionsRoot: string;
  uncles: string[];
  withdrawals?: IJsonRpcWithdrawal[];
  withdrawalsRoot?: string;
  blobGasUsed?: string;
  excessBlobGas?: string;
}

export interface IJsonRpcWithdrawal {
  index: string;
  validatorIndex: string;
  address: string;
  amount: string;
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
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  input: string;
}

export interface IJsonRpcReceipt {
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
  from: string;
  to: string | null;
  cumulativeGasUsed: string;
  gasUsed: string;
  contractAddress: string | null;
  // ToDo: (20260130 - Julian) fix type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs: any[];
  logsBloom: string;
  status: string; // Info: (20260130 - Julian) 0x1 success, 0x0 failure
  effectiveGasPrice: string;
  type: string;
}
