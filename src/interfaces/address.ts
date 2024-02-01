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
  relatedAddresses: {id: string; chainId: string}[];
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
