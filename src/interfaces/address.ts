import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';
import {IRiskLevel, RiskLevel} from '../constants/risk_level';
import {IInteractionItem} from './interaction_item';

export interface IAddress extends IInteractionItem {
  //id: string;
  addressId: string;
  //chainId: string;
  //createdTimestamp: number;
  lastestActiveTime: number;
  relatedAddressIds: string[];
  interactedAddressIds: string[];
  interactedContactIds: string[];
  //transactionIds: string[];
  flagging: IRedFlagType[];
  riskLevel: IRiskLevel;
  //publicTag: string[];
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
}

export const dummyAddressData: IAddress[] = [
  {
    id: '130008',
    type: 'address',
    addressId: '0x5Ab3190693fEc256156f9f74Cd8843A77277',
    chainId: 'isun',
    createdTimestamp: 1535762837,
    lastestActiveTime: 1696710310,
    relatedAddressIds: ['130089', '130294', '130025'],
    interactedAddressIds: ['130089', '130294', '130025'],
    interactedContactIds: ['330029'],
    transactionIds: ['930032', '930071'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '130025',
    type: 'address',
    addressId: '0x11256d88475D319156fx93fEc3f74A79Cd0693fEc3',
    chainId: 'isun',
    createdTimestamp: 1672932841,
    lastestActiveTime: 1697174618,
    relatedAddressIds: ['130682', '134902', '130008'],
    interactedAddressIds: ['130682', '134902', '130008'],
    interactedContactIds: [],
    transactionIds: ['930291', '930683'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '130089',
    type: 'address',
    addressId: '0x2775D319156f9f74Cd0693fEc256d8843A79',
    chainId: 'isun',
    createdTimestamp: 1680935382,
    lastestActiveTime: 1682746184,
    relatedAddressIds: ['130008', '130682'],
    interactedAddressIds: ['130008', '130682'],
    interactedContactIds: [],
    transactionIds: ['930032', '931302'],
    flagging: [RedFlagType.LARGE_WITHDRAW],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '130294',
    type: 'address',
    addressId: '0x27256d3982516f9f34903674Cd0693fEcA79',
    chainId: 'isun',
    createdTimestamp: 1682801849,
    lastestActiveTime: 1688201837,
    relatedAddressIds: ['130008'],
    interactedAddressIds: ['130008'],
    interactedContactIds: ['330071'],
    transactionIds: ['930071'],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '130682',
    type: 'address',
    addressId: '0x67843A7990693fEc2575D31Cd86d156f9f74',
    chainId: 'isun',
    createdTimestamp: 1635603109,
    lastestActiveTime: 1677176283,
    relatedAddressIds: ['130025', '130089'],
    interactedAddressIds: ['130025', '130089'],
    interactedContactIds: ['330077'],
    transactionIds: ['930291', '931302'],
    flagging: [RedFlagType.GAMBLING_SITE],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '134902',
    type: 'address',
    addressId: '0x27256d3982516f9f34903674Cd0693fEcA79',
    chainId: 'isun',
    createdTimestamp: 1680188201,
    lastestActiveTime: 1682168283,
    relatedAddressIds: ['130008', '130025'],
    interactedAddressIds: ['130008', '130025'],
    interactedContactIds: ['330291'],
    transactionIds: ['930683'],
    flagging: [RedFlagType.GAMBLING_SITE, RedFlagType.PRIVACY_COINS],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Hacker'],
  },
  {
    id: '110029',
    type: 'address',
    addressId: '0x156f9f74C2775D3190693fEc256dd8843A79',
    chainId: 'btc',
    createdTimestamp: 1667129031,
    lastestActiveTime: 1683709357,
    relatedAddressIds: ['110132', '114007'],
    interactedAddressIds: ['110132', '114007'],
    interactedContactIds: [],
    transactionIds: ['910101', '914025'],
    flagging: [RedFlagType.PRIVACY_COINS],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '110132',
    type: 'address',
    addressId: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    createdTimestamp: 1680827461,
    lastestActiveTime: 1682935384,
    relatedAddressIds: ['110029', '112840', '114007'],
    interactedAddressIds: ['110029', '112840', '114007'],
    interactedContactIds: ['310683'],
    transactionIds: ['910101', '912299', '918402'],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '112840',
    type: 'address',
    addressId: '0x8e9f74C775D3190693fEc256d156dD865A79',
    chainId: 'btc',
    createdTimestamp: 1682746180,
    lastestActiveTime: 1685902948,
    relatedAddressIds: ['110132', '113992', '115588'],
    interactedAddressIds: ['110132', '113992', '115588'],
    interactedContactIds: ['310992', '312817'],
    transactionIds: ['912299', '913211', '919298'],
    flagging: [RedFlagType.DARKNET, RedFlagType.BLACK_LIST],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Hacker'],
  },
  {
    id: '113992',
    type: 'address',
    addressId: '0x1975d156f9f74D3190693fEc256Cd88243a04',
    chainId: 'btc',
    createdTimestamp: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: ['112840', '114007', '115588'],
    interactedAddressIds: ['112840', '114007', '115588'],
    interactedContactIds: [],
    transactionIds: ['913211', '915024', '916841'],
    flagging: [RedFlagType.MIXING_SERVICE],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '114007',
    type: 'address',
    addressId: '0x1975d15693fEc256Cd88243a0f9f74D319064',
    chainId: 'btc',
    createdTimestamp: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: ['110029', '113992', '110132'],
    interactedAddressIds: ['110029', '113992', '110132'],
    interactedContactIds: ['311025', '311382'],
    transactionIds: ['914025', '915024', '918402'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '115588',
    type: 'address',
    addressId: '0x1975d1566Cd88243a0f9f74D319093fEc2564',
    chainId: 'btc',
    createdTimestamp: 16853990284,
    lastestActiveTime: 1688435283,
    relatedAddressIds: ['113992', '112840'],
    interactedAddressIds: ['113992', '112840'],
    interactedContactIds: ['311382'],
    transactionIds: ['916841', '919298'],
    flagging: [RedFlagType.DARKNET],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Hacker'],
  },
  {
    id: '120499',
    type: 'address',
    addressId: '0x693fEc156dD863199f74C7069d5A25675D42',
    chainId: 'eth',
    createdTimestamp: 1670274180,
    lastestActiveTime: 1697332361,
    relatedAddressIds: ['120999', '123201'],
    interactedAddressIds: ['120999', '123201'],
    interactedContactIds: [],
    transactionIds: ['920219', '928728'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '120999',
    type: 'address',
    addressId: '0x4C99f7A2c156dD8635675D429d5706fE1693',
    chainId: 'eth',
    createdTimestamp: 1683274111,
    lastestActiveTime: 1687366666,
    relatedAddressIds: ['120499', '123201'],
    interactedAddressIds: ['120499', '123201'],
    interactedContactIds: ['320062'],
    transactionIds: ['920219'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '123201',
    type: 'address',
    addressId: '0x4C706fE199f5675D429d56937A2c156dD863',
    chainId: 'eth',
    createdTimestamp: 1674183211,
    lastestActiveTime: 16873619373,
    relatedAddressIds: ['121700', '120999', '120499'],
    interactedAddressIds: ['121700', '120999', '120499'],
    interactedContactIds: ['320592', '320728'],
    transactionIds: ['923372', '928728', '924713'],
    flagging: [RedFlagType.MULTIPLE_RECEIVES],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '121700',
    type: 'address',
    addressId: '0x4C706fE199f7A2c156dD8635675D429d5693',
    chainId: 'eth',
    createdTimestamp: 1688223345,
    lastestActiveTime: 1689301831,
    relatedAddressIds: ['122810', '123201'],
    interactedAddressIds: ['122810', '123201'],
    interactedContactIds: ['320293'],
    transactionIds: ['922372', '923372'],
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '122810',
    type: 'address',
    addressId: '0x8635675D429d56934C706fE199f7A2c156dD',
    chainId: 'eth',
    createdTimestamp: 1687222335,
    lastestActiveTime: 1689317332,
    relatedAddressIds: ['121700', ''],
    interactedAddressIds: ['121700', ''],
    interactedContactIds: [],
    transactionIds: ['922372'],
    flagging: [RedFlagType.HIGH_RISK_LOCATION],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '140002',
    type: 'address',
    addressId: '0x6C04f7A2c15675D42391dD863d5706fE1693',
    chainId: 'usdt',
    createdTimestamp: 1683266111,
    lastestActiveTime: 1697366746,
    relatedAddressIds: ['140007', '140050'],
    interactedAddressIds: ['140007', '140050'],
    interactedContactIds: ['342001', '340042'],
    transactionIds: ['940202', '940555', '944499'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '140007',
    type: 'address',
    addressId: '0x3d5706f6C04f7A2c15675D42391dD86E10291',
    chainId: 'usdt',
    createdTimestamp: 1681366321,
    lastestActiveTime: 1689761746,
    relatedAddressIds: ['140002', '140050', '140333'],
    interactedAddressIds: ['140002', '140050', '140333'],
    interactedContactIds: [],
    transactionIds: ['940202', '941749', '944499', '944777'],
    flagging: [RedFlagType.PRIVACY_COINS],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '140050',
    type: 'address',
    addressId: '0x3d5706f6C04f7A2c15675D42391dD86E10291',
    chainId: 'usdt',
    createdTimestamp: 1681366321,
    lastestActiveTime: 1689761746,
    relatedAddressIds: ['140002', '140007'],
    interactedAddressIds: ['140002', '140007'],
    interactedContactIds: ['341938'],
    transactionIds: ['940555', '941749'],
    flagging: [RedFlagType.GAMBLING_SITE, RedFlagType.DARKNET],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['Hacker'],
  },
  {
    id: '140333',
    type: 'address',
    addressId: '0x6C04f7A2c33333D42391dD863d5706fE1693',
    chainId: 'usdt',
    createdTimestamp: 1683262333,
    lastestActiveTime: 1697366333,
    relatedAddressIds: ['140007', '144055'],
    interactedAddressIds: ['140007', '144055'],
    interactedContactIds: ['343917'],
    transactionIds: ['944777', '945008'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '144055',
    type: 'address',
    addressId: '0x6E102913d57c15675D4206f6C04f7A2391dD8',
    chainId: 'usdt',
    createdTimestamp: 1681617321,
    lastestActiveTime: 1689746663,
    relatedAddressIds: ['140333'],
    interactedAddressIds: ['140333'],
    interactedContactIds: ['344321'],
    transactionIds: ['945008'],
    flagging: [RedFlagType.LARGE_DEPOSIT],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '144338',
    type: 'address',
    addressId: '0x6Ec15913d67665C04f7A2391dD1618D4206f6',
    chainId: 'usdt',
    createdTimestamp: 16841027321,
    lastestActiveTime: 1689646357,
    relatedAddressIds: ['146605'],
    interactedAddressIds: ['146605'],
    interactedContactIds: [],
    transactionIds: ['945449'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '146605',
    type: 'address',
    addressId: '0x18D46Ec15913d67665C0217A2391dD16206f6',
    chainId: 'usdt',
    createdTimestamp: 16844617321,
    lastestActiveTime: 1689602357,
    relatedAddressIds: ['144338'],
    interactedAddressIds: ['144338'],
    interactedContactIds: ['345673'],
    transactionIds: ['945449'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '150381',
    type: 'address',
    addressId: '0x183d67D46Ec1A2391dD16591665C0217206f6',
    chainId: 'bnb',
    createdTimestamp: 16841734621,
    lastestActiveTime: 1689235607,
    relatedAddressIds: ['150472'],
    interactedAddressIds: ['150472'],
    interactedContactIds: [],
    transactionIds: ['955549'],
    flagging: [RedFlagType.LARGE_WITHDRAW],
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['Unknown User'],
  },
  {
    id: '150472',
    type: 'address',
    addressId: '0x183d1659166567D46Ec1A2391dDC0217206f6',
    chainId: 'bnb',
    createdTimestamp: 16846071721,
    lastestActiveTime: 1689346235,
    relatedAddressIds: ['150381'],
    interactedAddressIds: ['150381'],
    interactedContactIds: [],
    transactionIds: ['955549'],
    flagging: [],
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['Unknown User'],
  },
];
