import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {IRiskLevel, RiskLevel} from '../constants/risk_level';

export interface IAddress {
  id: number;
  addressId: string;
  chainId: string;
  signUpTime: number;
  lastestActiveTime: number;
  relatedAddressIds: number[];
  interactedAddressIds: number[];
  interactedContactIds: number[];
  flagging: IRedFlagType[];
  riskLevel: IRiskLevel;
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
}

export const dummyAddressData: IAddress[] = [
  {
    id: 345082,
    addressId: '0x5Ab3190693fEc256156f9f74Cd8843A77277',
    chainId: 'isun',
    signUpTime: 1535762837,
    lastestActiveTime: 1696710310,
    relatedAddressIds: [345288, 382984],
    interactedAddressIds: [328420, 328421, 373312, 345288, 382984],
    interactedContactIds: [62738, 62739],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: 345288,
    addressId: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    signUpTime: 1667103109,
    lastestActiveTime: 1683735762,
    relatedAddressIds: [345082, 329301, 382984],
    interactedAddressIds: [328420, 328421, 324801],
    interactedContactIds: [60093, 60932, 69301],
    flagging: [RedFlagType.MULTIPLE_TRANSFER, RedFlagType.MULTIPLE_RECEIVES],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: 329301,
    addressId: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    signUpTime: 1680827461,
    lastestActiveTime: 1682935384,
    relatedAddressIds: [345288],
    interactedAddressIds: [345288],
    interactedContactIds: [60093],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: 382984,
    addressId: '0x67843A7990693fEc2575D31Cd86d156f9f74',
    chainId: 'eth',
    signUpTime: 1635603109,
    lastestActiveTime: 1677176283,
    relatedAddressIds: [345288, 345082],
    interactedAddressIds: [345288, 324801, 345082],
    interactedContactIds: [60932, 69301],
    flagging: [RedFlagType.GAMBLING_SITE],
    riskLevel: RiskLevel.HIGH_RISK,
  },
];
