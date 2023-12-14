import {IRiskLevel, RiskLevel} from '../constants/risk_level';
import {IBlock} from './block';
import {IInteractionItem} from './interaction_item';
import {IRedFlag, getDummyRedFlag} from './red_flag';
import {IReview} from './review';

export interface IAddress extends IInteractionItem {
  address: string;
  chainIcon: string;
  latestActiveTime: number;
  relatedAddressIds: string[];
  interactedAddressCount: number;
  interactedContactCount: number;
  flagging: IRedFlag[];
  flaggingCount: number;
  riskLevel: IRiskLevel;
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
  blockProducedData: IBlock[];
  reviewData: IReview[];
}
/* 
export const dummyAddressData: IAddress[] = [
  {
    id: '130008',
    type: 'address',
    address: '0x5Ab3190693fEc256156f9f74Cd8843A77277',
    chainId: 'isun',
    chainIcon: '/currencies/isun.svg',
    createdTimestamp: 1535762837,
    latestActiveTime: 1696710310,
    relatedAddressIds: ['130089', '130294', '130025'],
    interactedAddressCount: ['130089', '130294', '130025'],
    interactedContactCount: ['330029'],
    transactionHistoryData: ['930032', '930071'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '130025',
    type: 'address',
    address: '0x11256d88475D319156fx93fEc3f74A79Cd069',
    chainId: 'isun',
    chainIcon: '/currencies/isun.svg',
    createdTimestamp: 1672932841,
    latestActiveTime: 1697174618,
    relatedAddressIds: ['130682', '134902', '130008'],
    interactedAddressCount: ['130682', '134902', '130008'],
    interactedContactCount: [],
    transactionHistoryData: ['930291', '930683'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '130089',
    type: 'address',
    address: '0x2775D319156f9f74Cd0693fEc256d8843A79',
    chainId: 'isun',
    chainIcon: '/currencies/isun.svg',
    createdTimestamp: 1680935382,
    latestActiveTime: 1682746184,
    relatedAddressIds: ['130008', '130682'],
    interactedAddressCount: ['130008', '130682'],
    interactedContactCount: [],
    transactionHistoryData: ['930032', '931302'],
    flagging: getDummyRedFlag('isun', '130089', 3),
    flaggingCount: 3,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '130294',
    type: 'address',
    address: '0x27256d3982516f9f34903674Cd0693fEcA79',
    chainId: 'isun',
    chainIcon: '/currencies/isun.svg',
    createdTimestamp: 1682801849,
    latestActiveTime: 1688201837,
    relatedAddressIds: ['130008'],
    interactedAddressCount: ['130008'],
    interactedContactCount: ['330071'],
    transactionHistoryData: ['930071'],
    flagging: getDummyRedFlag('isun', '130294', 2),
    flaggingCount: 2,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '130682',
    type: 'address',
    address: '0x67843A7990693fEc2575D31Cd86d156f9f74',
    chainId: 'isun',
    chainIcon: '/currencies/isun.svg',
    createdTimestamp: 1635603109,
    latestActiveTime: 1677176283,
    relatedAddressIds: ['130025', '130089'],
    interactedAddressCount: ['130025', '130089'],
    interactedContactCount: ['330077'],
    transactionHistoryData: ['930291', '931302'],
    flagging: getDummyRedFlag('isun', '130682', 7),
    flaggingCount: 7,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '134902',
    type: 'address',
    address: '0x27256d3982516f9f34903674Cd0693fEcA79',
    chainId: 'isun',
    chainIcon: '/currencies/isun.svg',
    createdTimestamp: 1680188201,
    latestActiveTime: 1682168283,
    relatedAddressIds: ['130008', '130025'],
    interactedAddressCount: ['130008', '130025'],
    interactedContactCount: ['330291'],
    transactionHistoryData: ['930683'],
    flagging: getDummyRedFlag('isun', '134902', 15),
    flaggingCount: 15,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '110029',
    type: 'address',
    address: '0x156f9f74C2775D3190693fEc256dd8843A79',
    chainId: 'btc',
    chainIcon: '/currencies/btc.svg',
    createdTimestamp: 1667129031,
    latestActiveTime: 1683709357,
    relatedAddressIds: ['110132', '114007'],
    interactedAddressCount: ['110132', '114007'],
    interactedContactCount: [],
    transactionHistoryData: ['910101', '914025'],
    flagging: getDummyRedFlag('btc', '110029', 5),
    flaggingCount: 5,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '110132',
    type: 'address',
    address: '0x2775D3190693fEc256d156f9f74Cd8843A79',
    chainId: 'btc',
    chainIcon: '/currencies/btc.svg',
    createdTimestamp: 1680827461,
    latestActiveTime: 1682935384,
    relatedAddressIds: ['110029', '112840', '114007'],
    interactedAddressCount: ['110029', '112840', '114007'],
    interactedContactCount: ['310683'],
    transactionHistoryData: ['910101', '912299', '918402'],
    flagging: getDummyRedFlag('btc', '110132', 4),
    flaggingCount: 4,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '112840',
    type: 'address',
    address: '0x8e9f74C775D3190693fEc256d156dD865A79',
    chainId: 'btc',
    chainIcon: '/currencies/btc.svg',
    createdTimestamp: 1682746180,
    latestActiveTime: 1685902948,
    relatedAddressIds: ['110132', '113992', '115588'],
    interactedAddressCount: ['110132', '113992', '115588'],
    interactedContactCount: ['310992', '312817'],
    transactionHistoryData: ['912299', '913211', '919298'],
    flagging: getDummyRedFlag('btc', '112840', 8),
    flaggingCount: 8,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '113992',
    type: 'address',
    address: '0x1975d156f9f74D3190693fEc256Cd88243a04',
    chainId: 'btc',
    chainIcon: '/currencies/btc.svg',
    createdTimestamp: 16853990284,
    latestActiveTime: 1688435283,
    relatedAddressIds: ['112840', '114007', '115588'],
    interactedAddressCount: ['112840', '114007', '115588'],
    interactedContactCount: [],
    transactionHistoryData: ['913211', '915024', '916841'],
    flagging: getDummyRedFlag('btc', '113992', 3),
    flaggingCount: 3,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '114007',
    type: 'address',
    address: '0x1975d15693fEc256Cd88243a0f9f74D319064',
    chainId: 'btc',
    chainIcon: '/currencies/btc.svg',
    createdTimestamp: 1685399284,
    latestActiveTime: 1688435283,
    relatedAddressIds: ['110029', '113992', '110132'],
    interactedAddressCount: ['110029', '113992', '110132'],
    interactedContactCount: ['311025', '311382'],
    transactionHistoryData: ['914025', '915024', '918402'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '115588',
    type: 'address',
    address: '0x1975d1566Cd88243a0f9f74D319093fEc2564',
    chainId: 'btc',
    chainIcon: '/currencies/btc.svg',
    createdTimestamp: 1685390284,
    latestActiveTime: 1688435283,
    relatedAddressIds: ['113992', '112840'],
    interactedAddressCount: ['113992', '112840'],
    interactedContactCount: ['311382'],
    transactionHistoryData: ['916841', '919298'],
    flagging: getDummyRedFlag('btc', '115588', 21),
    flaggingCount: 21,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '120499',
    type: 'address',
    address: '0x693fEc156dD863199f74C7069d5A25675D42',
    chainId: 'eth',
    chainIcon: '/currencies/eth.svg',
    createdTimestamp: 1670274180,
    latestActiveTime: 1697332361,
    relatedAddressIds: ['120999', '123201'],
    interactedAddressCount: ['120999', '123201'],
    interactedContactCount: [],
    transactionHistoryData: ['920219', '928728'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '120999',
    type: 'address',
    address: '0x4C99f7A2c156dD8635675D429d5706fE1693',
    chainId: 'eth',
    chainIcon: '/currencies/eth.svg',
    createdTimestamp: 1683274111,
    latestActiveTime: 1687366666,
    relatedAddressIds: ['120499', '123201'],
    interactedAddressCount: ['120499', '123201'],
    interactedContactCount: ['320062'],
    transactionHistoryData: ['920219'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '123201',
    type: 'address',
    address: '0x4C706fE199f5675D429d56937A2c156dD863',
    chainId: 'eth',
    chainIcon: '/currencies/eth.svg',
    createdTimestamp: 1674183211,
    latestActiveTime: 1687619373,
    relatedAddressIds: ['121700', '120999', '120499'],
    interactedAddressCount: ['121700', '120999', '120499'],
    interactedContactCount: ['320592', '320728'],
    transactionHistoryData: ['923372', '928728', '924713'],
    flagging: getDummyRedFlag('eth', '123201', 4),
    flaggingCount: 4,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '121700',
    type: 'address',
    address: '0x4C706fE199f7A2c156dD8635675D429d5693',
    chainId: 'eth',
    chainIcon: '/currencies/eth.svg',
    createdTimestamp: 1688223345,
    latestActiveTime: 1689301831,
    relatedAddressIds: ['122810', '123201'],
    interactedAddressCount: ['122810', '123201'],
    interactedContactCount: ['320293'],
    transactionHistoryData: ['922372', '923372'],
    flagging: getDummyRedFlag('eth', '121700', 12),
    flaggingCount: 12,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '122810',
    type: 'address',
    address: '0x8635675D429d56934C706fE199f7A2c156dD',
    chainId: 'eth',
    chainIcon: '/currencies/eth.svg',
    createdTimestamp: 1687222335,
    latestActiveTime: 1689317332,
    relatedAddressIds: ['121700', ''],
    interactedAddressCount: ['121700', ''],
    interactedContactCount: [],
    transactionHistoryData: ['922372'],
    flagging: getDummyRedFlag('eth', '122810', 17),
    flaggingCount: 17,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '140002',
    type: 'address',
    address: '0x6C04f7A2c15675D42391dD863d5706fE1693',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 1683266111,
    latestActiveTime: 1697366746,
    relatedAddressIds: ['140007', '140050'],
    interactedAddressCount: ['140007', '140050'],
    interactedContactCount: ['342001', '340042'],
    transactionHistoryData: ['940202', '940555', '944499'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '140007',
    type: 'address',
    address: '0x3d5706f6C04f7A2c15675D42391dD86E10291',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 1681366321,
    latestActiveTime: 1689761746,
    relatedAddressIds: ['140002', '140050', '140333'],
    interactedAddressCount: ['140002', '140050', '140333'],
    interactedContactCount: [],
    transactionHistoryData: ['940202', '941749', '944499', '944777'],
    flagging: getDummyRedFlag('usdt', '140007', 5),
    flaggingCount: 5,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '140050',
    type: 'address',
    address: '0x3d5706f6C04f7A2c15675D42391dD86E10291',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 1681366321,
    latestActiveTime: 1689761746,
    relatedAddressIds: ['140002', '140007'],
    interactedAddressCount: ['140002', '140007'],
    interactedContactCount: ['341938'],
    transactionHistoryData: ['940555', '941749'],
    flagging: getDummyRedFlag('usdt', '140050', 39),
    flaggingCount: 39,
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
  {
    id: '140333',
    type: 'address',
    address: '0x6C04f7A2c33333D42391dD863d5706fE1693',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 1683262333,
    latestActiveTime: 1697366333,
    relatedAddressIds: ['140007', '144055'],
    interactedAddressCount: ['140007', '144055'],
    interactedContactCount: ['343917'],
    transactionHistoryData: ['944777', '945008'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '144055',
    type: 'address',
    address: '0x6E102913d57c15675D4206f6C04f7A2391dD8',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 1681617321,
    latestActiveTime: 1689746663,
    relatedAddressIds: ['140333'],
    interactedAddressCount: ['140333'],
    interactedContactCount: ['344321'],
    transactionHistoryData: ['945008'],
    flagging: getDummyRedFlag('usdt', '144055', 4),
    flaggingCount: 4,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '144338',
    type: 'address',
    address: '0x6Ec15913d67665C04f7A2391dD1618D4206f6',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 16841027321,
    latestActiveTime: 1689646357,
    relatedAddressIds: ['146605'],
    interactedAddressCount: ['146605'],
    interactedContactCount: [],
    transactionHistoryData: ['945449'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '146605',
    type: 'address',
    address: '0x18D46Ec15913d67665C0217A2391dD16206f6',
    chainId: 'usdt',
    chainIcon: '/currencies/usdt.svg',
    createdTimestamp: 16844617321,
    latestActiveTime: 1689602357,
    relatedAddressIds: ['144338'],
    interactedAddressCount: ['144338'],
    interactedContactCount: ['345673'],
    transactionHistoryData: ['945449'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '150381',
    type: 'address',
    address: '0x183d67D46Ec1A2391dD16591665C0217206f6',
    chainId: 'bnb',
    chainIcon: '/currencies/bnb.svg',
    createdTimestamp: 16841734621,
    latestActiveTime: 1689235607,
    relatedAddressIds: ['150472'],
    interactedAddressCount: ['150472'],
    interactedContactCount: [],
    transactionHistoryData: ['955549'],
    flagging: getDummyRedFlag('bnb', '150381', 4),
    flaggingCount: 4,
    riskLevel: RiskLevel.MEDIUM_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '150472',
    type: 'address',
    address: '0x183d1659166567D46Ec1A2391dDC0217206f6',
    chainId: 'bnb',
    chainIcon: '/currencies/bnb.svg',
    createdTimestamp: 16846071721,
    latestActiveTime: 1689346235,
    relatedAddressIds: ['150381'],
    interactedAddressCount: ['150381'],
    interactedContactCount: [],
    transactionHistoryData: ['955549'],
    flagging: [],
    flaggingCount: 0,
    riskLevel: RiskLevel.LOW_RISK,
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
]; 
*/

export const dummyBlacklistAddressData: IAddress[] = [
  {
    id: '150472',
    type: 'address',
    address: '0x183d1659166567D46Ec1A2391dDC0217206f6',
    chainId: 'bnb',
    chainIcon: '/currencies/bnb.svg',
    createdTimestamp: 16846071721,
    latestActiveTime: 1689346235,
    relatedAddressIds: ['150381'],
    interactedAddressCount: 13,
    interactedContactCount: 123,
    transactionHistoryData: [],
    blockProducedData: [],
    flagging: [],
    flaggingCount: 10,
    reviewData: [],
    riskLevel: RiskLevel.HIGH_RISK,
    publicTag: ['PUBLIC_TAG.HACKER'],
  },
];
