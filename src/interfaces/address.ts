import {IProductionBlock} from './block';
import {ICommonData} from './common_data';
import {IInteractionItem} from './interaction_item';
import {IReviewDetail} from './review';
import {IDisplayTransaction} from './transaction';

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
  transactionHistoryData: IDisplayTransaction[];
  score: number;
  reviewData: IReviewDetail[];
}
