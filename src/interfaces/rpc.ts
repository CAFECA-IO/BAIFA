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
  receiptsRoot: string;
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

  mixHash?: string;
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
  blockHash: string | null;
  blockNumber: string | null;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: string;
  to: string | null;
  transactionIndex: string | null;
  value: string;
  type: string;
  v: string;
  r: string;
  s: string;
  // EIP-1559 可能包含的欄位
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
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
