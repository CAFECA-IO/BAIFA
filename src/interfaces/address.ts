import {IRiskLevel, RiskLevel} from '../constants/risk_level';
import {IProductionBlock} from './block';
import {IInteractionItem} from './interaction_item';
import {IRedFlag} from './red_flag';
import {IReviewDetail} from './review';

export interface IAddress extends IInteractionItem {
  address: string;
  latestActiveTime: number;
  relatedAddresses: {id: string; chainId: string}[];
  interactedAddressCount: number;
  interactedContactCount: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  riskLevel: IRiskLevel;
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
  blockProducedData: IProductionBlock[];
  score: number;
  reviewData: IReviewDetail[];
}
