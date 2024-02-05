import {IProductionBlock} from './block';
import {ICommonData} from './common_data';
import {IInteractionItem} from './interaction_item';
import {IReviewDetail} from './review';
import {ITransaction} from './transaction';

export interface IAddress extends ICommonData {
  address: string;
  flaggingCount: number;
  riskLevel: string;
}

export interface IAddressDetail extends IInteractionItem, IAddress {
  latestActiveTime: number;
  //relatedAddresses: {id: string; chainId: string}[]; // ToDo: (20240201 - Julian) 可能移除
  interactedAddressCount: number;
  interactedContactCount: number;
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
  blockProducedData: IProductionBlock[];
  transactionHistoryData: ITransaction[];
  score: number;
  reviewData: IReviewDetail[];
}

export const dummyAddress: IAddressDetail = {
  id: '1',
  type: 'address',
  address: '0x',
  chainId: '1',
  createdTimestamp: 0,
  latestActiveTime: 0,
  interactedAddressCount: 0,
  interactedContactCount: 0,
  score: 0,
  reviewData: [],
  transactionHistoryData: [],
  transactionCount: 0,
  blockProducedData: [],
  flaggingCount: 0,
  riskLevel: 'LOW_RISK',
  publicTag: [],
};
