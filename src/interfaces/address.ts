import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {IRiskLevel, RiskLevel} from '../constants/risk_level';

export interface IAddress {
  id: string;
  addressId: string;
  chainId: string;
  signUpTime: number;
  lastestActiveTime: number;
  relatedAddressIds: string[];
  interactedAddressIds: string[];
  interactedContactIds: string[];
  transactionIds: string[];
  flagging: IRedFlagType[];
  riskLevel: IRiskLevel;
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
}

export const dummyAddressData: IAddress[] = [
  {
    id: '130008',
    addressId: '0x5Ab3190693fEc256156f9f74Cd8843A77277',
    chainId: 'isun',
    signUpTime: 1535762837,
    lastestActiveTime: 1696710310,
    relatedAddressIds: ['130089', '130294', '130025'],
    interactedAddressIds: ['130089', '130294', '130025'],
    interactedContactIds: ['62738', '62739'],
    transactionIds: ['930032', '930071'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: '130025',
    addressId: '0x11256d88475D319156fx93fEc3f74A79Cd0693fEc3',
    chainId: 'isun',
    signUpTime: 1672932841,
    lastestActiveTime: 1697174618,
    relatedAddressIds: ['130682', '134902', '130008'],
    interactedAddressIds: ['130682', '134902', '130008'],
    interactedContactIds: ['61932', '60327', '64324'],
    transactionIds: ['930291', '930683'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: '130089',
    addressId: '0x2775D319156f9f74Cd0693fEc256d8843A79',
    chainId: 'isun',
    signUpTime: 1680935382,
    lastestActiveTime: 1682746184,
    relatedAddressIds: ['130008', '130682'],
    interactedAddressIds: ['130008', '130682'],
    interactedContactIds: ['63232'],
    transactionIds: ['930032', '931302'],
    flagging: [RedFlagType.LARGE_WITHDRAW],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: '130294',
    addressId: '0x27256d3982516f9f34903674Cd0693fEcA79',
    chainId: 'isun',
    signUpTime: 1682801849,
    lastestActiveTime: 1688201837,
    relatedAddressIds: ['130008'],
    interactedAddressIds: ['130008'],
    interactedContactIds: ['60294', '62820'],
    transactionIds: ['930071'],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: '130682',
    addressId: '0x67843A7990693fEc2575D31Cd86d156f9f74',
    chainId: 'isun',
    signUpTime: 1635603109,
    lastestActiveTime: 1677176283,
    relatedAddressIds: ['130025', '130089'],
    interactedAddressIds: ['130025', '130089'],
    interactedContactIds: ['60932', '69301'],
    transactionIds: ['930291', '931302'],
    flagging: [RedFlagType.GAMBLING_SITE],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: '134902',
    addressId: '0x27256d3982516f9f34903674Cd0693fEcA79',
    chainId: 'isun',
    signUpTime: 1680188201,
    lastestActiveTime: 1682168283,
    relatedAddressIds: ['130008', '130025'],
    interactedAddressIds: ['130008', '130025'],
    interactedContactIds: ['60001', '69183'],
    transactionIds: ['930683'],
    flagging: [RedFlagType.GAMBLING_SITE, RedFlagType.PRIVACY_COINS],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: '110029',
    addressId: '0x156f9f74C2775D3190693fEc256dd8843A79',
    chainId: 'btc',
    signUpTime: 1667129031,
    lastestActiveTime: 1683709357,
    relatedAddressIds: ['110132', '114007'],
    interactedAddressIds: ['110132', '114007'],
    interactedContactIds: ['62846', '61932', '67354'],
    transactionIds: ['910101', '914025'],
    flagging: [RedFlagType.PRIVACY_COINS],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: '110132',
    addressId: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    signUpTime: 1680827461,
    lastestActiveTime: 1682935384,
    relatedAddressIds: ['110029', '112840', '114007'],
    interactedAddressIds: ['110029', '112840', '114007'],
    interactedContactIds: ['60093'],
    transactionIds: ['910101', '912299', '918402'],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: '112840',
    addressId: '0x8e9f74C775D3190693fEc256d156dD865A79',
    chainId: 'btc',
    signUpTime: 1682746180,
    lastestActiveTime: 1685902948,
    relatedAddressIds: ['110132', '113992', '115588'],
    interactedAddressIds: ['110132', '113992', '115588'],
    interactedContactIds: ['60482', '65023', '68403'],
    transactionIds: ['912299', '913211', '919298'],
    flagging: [RedFlagType.DARKNET, RedFlagType.BLACK_LIST],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: '113992',
    addressId: '0x1975d156f9f74D3190693fEc256Cd88243a04',
    chainId: 'btc',
    signUpTime: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: ['112840', '114007', '115588'],
    interactedAddressIds: ['112840', '114007', '115588'],
    interactedContactIds: ['63992', '63281', '60433'],
    transactionIds: ['913211', '915024', '916841'],
    flagging: [RedFlagType.MIXING_SERVICE],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: '114007',
    addressId: '0x1975d15693fEc256Cd88243a0f9f74D319064',
    chainId: 'btc',
    signUpTime: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: ['110029', '113992', '110132'],
    interactedAddressIds: ['110029', '113992', '110132'],
    interactedContactIds: ['61731', '66666', '66402'],
    transactionIds: ['914025', '915024', '918402'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: '115588',
    addressId: '0x1975d1566Cd88243a0f9f74D319093fEc2564',
    chainId: 'btc',
    signUpTime: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: ['113992', '112840'],
    interactedAddressIds: ['113992', '112840'],
    interactedContactIds: ['60211', '67364'],
    transactionIds: ['916841', '919298'],
    flagging: [RedFlagType.DARKNET],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: '320499',
    addressId: '0x693fEc156dD863199f74C7069d5A25675D42',
    chainId: 'eth',
    signUpTime: 1670274180,
    lastestActiveTime: 1697332361,
    relatedAddressIds: ['320999', '323201'],
    interactedAddressIds: ['320999', '323201'],
    interactedContactIds: ['68403', '69038'],
    transactionIds: ['920219', '928728'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: '320999',
    addressId: '0x4C99f7A2c156dD8635675D429d5706fE1693',
    chainId: 'eth',
    signUpTime: 1683274111,
    lastestActiveTime: 1697366666,
    relatedAddressIds: ['320499', '323201'],
    interactedAddressIds: ['320499', '323201'],
    interactedContactIds: ['68403'],
    transactionIds: ['920219'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
  },
  {
    id: '323201',
    addressId: '0x4C706fE199f5675D429d56937A2c156dD863',
    chainId: 'eth',
    signUpTime: 1674183211,
    lastestActiveTime: 16873619373,
    relatedAddressIds: ['321700', '320999', '320499'],
    interactedAddressIds: ['321700', '320999', '320499'],
    interactedContactIds: ['68403'],
    transactionIds: ['923372', '928728', '924713'],
    flagging: [RedFlagType.MULTIPLE_RECEIVES],
    riskLevel: RiskLevel.MEDIUM_RISK,
  },
  {
    id: '321700',
    addressId: '0x4C706fE199f7A2c156dD8635675D429d5693',
    chainId: 'eth',
    signUpTime: 1688223345,
    lastestActiveTime: 1689301831,
    relatedAddressIds: ['322810', '323201'],
    interactedAddressIds: ['322810', '323201'],
    interactedContactIds: ['62201', '62842'],
    transactionIds: ['922372', '923372'],
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.HIGH_RISK,
  },
  {
    id: '322810',
    addressId: '0x8635675D429d56934C706fE199f7A2c156dD',
    chainId: 'eth',
    signUpTime: 1687222335,
    lastestActiveTime: 16893917332,
    relatedAddressIds: ['321700', ''],
    interactedAddressIds: ['321700', ''],
    interactedContactIds: ['62201', '62842'],
    transactionIds: ['922372'],
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.HIGH_RISK,
  },
];
