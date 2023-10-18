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
    relatedAddressIds: [345288, 382984, 398251],
    interactedAddressIds: [328420, 328421, 373312, 345288, 382984],
    interactedContactIds: [62738, 62739],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: 398251,
    addressId: '0x11256d88475D319156fx93fEc3f74A79Cd0693fEc3',
    chainId: 'isun',
    signUpTime: 1672932841,
    lastestActiveTime: 1697174618,
    relatedAddressIds: [345288, 345082, 392709],
    interactedAddressIds: [309284, 341336, 392709],
    interactedContactIds: [61932, 60327, 64324],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: 324801,
    addressId: '0x2775D319156f9f74Cd0693fEc256d8843A79',
    chainId: 'isun',
    signUpTime: 1680935382,
    lastestActiveTime: 1682746184,
    relatedAddressIds: [302841],
    interactedAddressIds: [309284, 349036],
    interactedContactIds: [63232],
    flagging: [RedFlagType.LARGE_WITHDRAW],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: 382984,
    addressId: '0x67843A7990693fEc2575D31Cd86d156f9f74',
    chainId: 'isun',
    signUpTime: 1635603109,
    lastestActiveTime: 1677176283,
    relatedAddressIds: [345288, 345082],
    interactedAddressIds: [345288, 324801, 345082],
    interactedContactIds: [60932, 69301],
    flagging: [RedFlagType.GAMBLING_SITE],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: 345288,
    addressId: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    signUpTime: 1667103109,
    lastestActiveTime: 1683735762,
    relatedAddressIds: [345082, 329301, 382984],
    interactedAddressIds: [328420, 398251, 328421, 324801],
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
    relatedAddressIds: [345288, 372840],
    interactedAddressIds: [345288, 372840],
    interactedContactIds: [60093],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: 399283,
    addressId: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    signUpTime: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: [399209, 392709],
    interactedAddressIds: [399209, 392709, 322130],
    interactedContactIds: [63992, 63281, 60433],
    flagging: [RedFlagType.MIXING_SERVICE],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: 372840,
    addressId: '0x8e9f74C775D3190693fEc256d156dD865A79',
    chainId: 'eth',
    signUpTime: 1682746180,
    lastestActiveTime: 16859302948,
    relatedAddressIds: [329301, 338261],
    interactedAddressIds: [329301, 338261],
    interactedContactIds: [60482, 65023, 68403],
    flagging: [RedFlagType.DARKNET, RedFlagType.BLACK_LIST],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: 338261,
    addressId: '0x693fEc156dD863199f74C7069d5A25675D42',
    chainId: 'eth',
    signUpTime: 1670274180,
    lastestActiveTime: 1697332361,
    relatedAddressIds: [372840],
    interactedAddressIds: [372840],
    interactedContactIds: [68403],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: 399209,
    addressId: '0x4C706fE199f7A2c156dD8635675D429d5693',
    chainId: 'eth',
    signUpTime: 1683274111,
    lastestActiveTime: 1697366666,
    relatedAddressIds: [328421, 399283],
    interactedAddressIds: [328421, 399283],
    interactedContactIds: [68403],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: 392709,
    addressId: '0x4C706fE199f7A2c156dD8635675D429d5693',
    chainId: 'eth',
    signUpTime: 1688223345,
    lastestActiveTime: 1689301831,
    relatedAddressIds: [398251, 399283],
    interactedAddressIds: [398251, 399283],
    interactedContactIds: [62201, 62842],
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.HIGH_RISK,
  },
];
