import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';

export interface ITransaction {
  id: string;
  hash: string;
  status: 'PROCESSING' | 'FAILED' | 'SUCCESS';
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  chainId: string;
  blockId: string;
  createdTimestamp: number;
  from: string;
  to: string;
  content: string;
  value: number;
  fee: number;
  flagging?: IRedFlagType;
}

export const dummyTransactionData: ITransaction[] = [
  {
    id: '934221',
    hash: '0xE47Dcf8aF9829AD3c4E31409eB6ECfecd046d1BD',
    type: 'NFT',
    status: 'FAILED',
    chainId: 'isun',
    blockId: '265675',
    createdTimestamp: 1688342795,
    from: '345082',
    to: '382984',
    content: '367845',
    value: 0.01,
    fee: 0.01,
    flagging: RedFlagType.MULTIPLE_RECEIVES,
  },
  {
    id: '931221',
    hash: '0x5AbfEc25f74Cd88437631A7731906932776356f9',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    chainId: 'isun',
    blockId: '265675',
    createdTimestamp: 1692342345,
    from: '324801',
    to: '491739',
    content: '390672',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '931291',
    hash: '0xA9ae1A01D7289f0BbBC7A88596EE4f9946f2A058',
    type: 'Evidence',
    status: 'PROCESSING',
    chainId: 'isun',
    blockId: '265678',
    createdTimestamp: 1689352795,
    from: '324801',
    to: '423867',
    content: '312539',
    value: 0.01,
    fee: 0.01,
    flagging: RedFlagType.BLACK_LIST,
  },
  {
    id: '931302',
    hash: '0xed13811c38aA7502fc2253f73a2a841Ce6808350',
    type: 'Crypto Currency',
    status: 'FAILED',
    chainId: 'isun',
    blockId: '265678',
    createdTimestamp: 1687352795,
    from: '398251',
    to: '434127',
    content: '338619',
    value: 0.01,
    fee: 0.01,
    flagging: RedFlagType.LARGE_WITHDRAW,
  },
  {
    id: '931314',
    hash: '0xE4197372A9190551eB25AB113b33a36af1b00Fa9',
    type: 'Evidence',
    status: 'SUCCESS',
    chainId: 'isun',
    blockId: '265678',
    createdTimestamp: 1688552795,
    from: '398251',
    to: '246137',
    content: '351389',
    value: 0.01,
    fee: 0.01,
    flagging: RedFlagType.GAMBLING_SITE,
  },
  {
    id: '900291',
    hash: '0xE41AB113b3397372A2900291eB25a36af1b00Fa9',
    type: 'Evidence',
    status: 'PROCESSING',
    chainId: 'isun',
    blockId: '265676',
    createdTimestamp: 1688158795,
    from: '345082',
    to: '247138',
    content: '312859',
    value: 0.01,
    fee: 0.01,
    flagging: RedFlagType.MULTIPLE_RECEIVES,
  },
  {
    id: '922372',
    hash: '0x3397C7c1FA3Da19701C429e8eED36bf528269e35',
    type: 'Evidence',
    status: 'PROCESSING',
    chainId: 'eth',
    blockId: '287654',
    createdTimestamp: 1689140295,
    from: '372840',
    to: '431716',
    content: '389057',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '922372',
    hash: '0x3397C7c1FA429e8eED36bf528269e33Da19701C5',
    type: 'Evidence',
    status: 'FAILED',
    chainId: 'eth',
    blockId: '287655',
    createdTimestamp: 1683322349,
    from: '338261',
    to: '68403',
    content: '301957',
    value: 0.01,
    fee: 0.01,
    flagging: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_DARKNET',
  },
  {
    id: '921372',
    hash: '0x3397C7c1FA429e8eED36bf528269e33Da19701C5',
    type: 'Crypto Currency',
    status: 'FAILED',
    chainId: 'eth',
    blockId: '287655',
    createdTimestamp: 1683122957,
    from: '399209',
    to: '68403',
    content: '314701',
    value: 0.01,
    fee: 0.01,
    flagging: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MIXING_SERVICE',
  },
  {
    id: '928713',
    hash: '0xF0Bfa7Cbc187184Cc07EBc24D76B3E4533581340',
    type: 'NFT',
    status: 'SUCCESS',
    chainId: 'eth',
    blockId: '287656',
    createdTimestamp: 1682222345,
    from: '372840',
    to: '60482',
    content: '3938678',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '928728',
    hash: '0xdF4A7c4a53aaa7Fe7a772014Ce24E4E566Df6952',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    chainId: 'eth',
    blockId: '287656',
    createdTimestamp: 1687222345,
    from: '392709',
    to: '324801',
    content: '3980183',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '983201',
    hash: '0x1234567890',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    chainId: 'btc',
    blockId: '287326',
    createdTimestamp: 1680978900,
    from: '329301',
    to: '491739',
    content: '345690',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '983210',
    hash: '0x1A773190695AbfEc25f74Cd884376332776356f1',
    type: 'Evidence',
    status: 'FAILED',
    chainId: 'btc',
    blockId: '287327',
    createdTimestamp: 1690000902,
    from: '399283',
    to: '402839',
    content: '368931',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '983211',
    hash: '0x1A773190695AbfEc25f74Cd884376332776356f1',
    type: 'Evidence',
    status: 'FAILED',
    chainId: 'btc',
    blockId: '287327',
    createdTimestamp: 1690000902,
    from: '329301',
    to: '402839',
    content: '340125',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '984025',
    hash: '0x3b9069fEc25f56f9537631A773A74Cd884132776',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    chainId: 'btc',
    blockId: '287328',
    createdTimestamp: 1698342345,
    from: '345288',
    to: '491750',
    content: '370672',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '984024',
    hash: '0x356f9537631A773Ab9069fEc25f74Cd884132776',
    type: 'Crypto Currency',
    status: 'SUCCESS',
    chainId: 'btc',
    blockId: '287328',
    createdTimestamp: 1692342345,
    from: '345288',
    to: '345082',
    content: '390672',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '902841',
    hash: '0x773A74Cd884139069fEc25f56f9537631A62773b',
    type: 'Evidence',
    status: 'FAILED',
    chainId: 'btc',
    blockId: '287328',
    createdTimestamp: 1698742345,
    from: '302841',
    to: '402812',
    content: '323472',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '984082',
    hash: '0x356f9537631A773Ab9069fEc25f74Cd884132776',
    type: 'Evidence',
    status: 'SUCCESS',
    chainId: 'btc',
    blockId: '287328',
    createdTimestamp: 1692342345,
    from: '329301',
    to: '491739',
    content: '390672',
    value: 0.01,
    fee: 0.01,
  },
  {
    id: '983298',
    hash: '0x5e043146d55274FcCE6F44c51aEE988cE87Ca86C',
    type: 'Crypto Currency',
    status: 'FAILED',
    chainId: 'btc',
    blockId: '287329',
    createdTimestamp: 1688312795,
    from: '399283',
    to: '412931',
    content: '301458',
    value: 0.01,
    fee: 0.01,
  },
];

export const getDummyTransactionData = (chainId: string): ITransaction[] => {
  return dummyTransactionData.filter(data => data.chainId === chainId);
};
