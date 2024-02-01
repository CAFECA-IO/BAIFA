import {IRedFlagType} from '../constants/red_flag_type';

export interface ITransaction {
  id: string;
  status: 'PROCESSING' | 'FAILED' | 'SUCCESS';
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  chainId: string;
  createdTimestamp: number;
  from: {type: string; address: string}[];
  to: {type: string; address: string}[];
}

export interface ITransactionDetail extends ITransaction {
  hash: string;
  blockId: string;
  evidenceId?: string;
  value: number;
  fee: number;
  flaggingRecords: {
    redFlagId: string;
    redFlagType: IRedFlagType;
  }[];
  unit: string;
}
