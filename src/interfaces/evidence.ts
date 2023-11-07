export interface IEvidence {
  id: string;
  chainId: string;
  evidenceHash: string;
  state: 'Active' | 'Inactive';
  creatorAddressId: string;
  createdTimestamp: number;
  content: string;
  transactionIds: string[];
}

export const dummyEvidenceData: IEvidence[] = [
  {
    id: '530029',
    chainId: 'isun',
    evidenceHash: '0x0E997eF9811E6bb8dcAB8c7300CCa190B56124a5',
    state: 'Active',
    creatorAddressId: '130008',
    createdTimestamp: 1688341795,
    content: '',
    transactionIds: ['930032', '930071', '931314'],
  },
  {
    id: '510071',
    chainId: 'btc',
    evidenceHash: '0x2326ce42a513a427a1ab5045a684e0a8ee8e96a13',
    state: 'Active',
    creatorAddressId: '114007',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['912299', '915024'],
  },
  {
    id: '515482',
    chainId: 'btc',
    evidenceHash: '0x9ba7147688000d831e10b555a8fe0ebb7f81bcd5',
    state: 'Active',
    creatorAddressId: '110132',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['913211', '916841'],
  },
  {
    id: '524713',
    chainId: 'eth',
    evidenceHash: '0xf4507fe9aa275752dbcb7f81bcd0b555a8fe0eb5',
    state: 'Active',
    creatorAddressId: '121700',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['922372'],
  },
  {
    id: '522761',
    chainId: 'eth',
    evidenceHash: '0xa275752dbcb7f81bcf4507fe9ad0b555a8fe0eb5',
    state: 'Active',
    creatorAddressId: '123201',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['924713', '923372'],
  },
  {
    id: '543201',
    chainId: 'usdt',
    evidenceHash: '0xa275F4A7c4a537f81bcf4507fe9ad0b544a8f7ee',
    state: 'Active',
    creatorAddressId: '140002',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['940202', '940555'],
  },
  {
    id: '548173',
    chainId: 'usdt',
    evidenceHash: '0xc4a537f81bcf4507fea275F40b544a8fA79ad709',
    state: 'Active',
    creatorAddressId: '140050',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['941749', '945008'],
  },
  {
    id: '543251',
    chainId: 'usdt',
    evidenceHash: '0xc4a537f81bc275F40b544a8fA79ad709f4507fea',
    state: 'Active',
    creatorAddressId: '146605',
    createdTimestamp: 1692322345,
    content: '',
    transactionIds: ['945449'],
  },
];
