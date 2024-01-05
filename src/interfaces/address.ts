import {IRiskLevel, RiskLevel} from '../constants/risk_level';
import {IProductionBlock} from './block';
import {IInteractionItem} from './interaction_item';
import {IRedFlag} from './red_flag';
import {IReviewDetail} from './review';

export interface IAddress extends IInteractionItem {
  address: string;
  chainIcon: string;
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

export const dummyBlacklistAddressData: IAddress[] = [
  {
    id: '150472',
    type: 'address',
    address: '0x183d1659166567D46Ec1A2391dDC0217206f6',
    chainId: 'bnb',
    chainIcon: '/currencies/bnb.svg',
    createdTimestamp: 16846071721,
    latestActiveTime: 1689346235,
    relatedAddresses: [
      {
        id: '150381',
        chainId: 'isun',
      },
    ],
    interactedAddressCount: 13,
    interactedContactCount: 123,
    transactionHistoryData: [],
    transactionCount: 10,
    blockProducedData: [],
    flagging: [],
    flaggingCount: 10,
    score: 2.34,
    reviewData: [],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
];
