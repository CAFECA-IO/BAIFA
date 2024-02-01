import {IProductionBlock} from './block';
import {ICommonData} from './common_data';
import {IInteractionItem} from './interaction_item';
import {IRedFlag} from './red_flag';
import {IReviewDetail} from './review';

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
  flagging: IRedFlag[];
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
  blockProducedData: IProductionBlock[];
  score: number;
  reviewData: IReviewDetail[];
}
