export interface IContract {
  id: string;
  chainId: string;
  creatorAddressId: string;
  createdTimestamp: number;
  sourceCode: string;
  transactionIds: string[];
}

export const dummyContractData: IContract[] = [
  {
    id: '330029',
    chainId: 'isun',
    creatorAddressId: '130008',
    createdTimestamp: 1688341795,
    sourceCode: '',
    transactionIds: ['930032', '931314'],
  },
  {
    id: '330071',
    chainId: 'isun',
    creatorAddressId: '130294',
    createdTimestamp: 1692322345,
    sourceCode: '',
    transactionIds: ['930071'],
  },
  {
    id: '330077',
    chainId: 'isun',
    creatorAddressId: '130682',
    createdTimestamp: 1693341175,
    sourceCode: '',
    transactionIds: ['930291', '931302'],
  },
  {
    id: '330291',
    chainId: 'isun',
    creatorAddressId: '134902',
    createdTimestamp: 1689352395,
    sourceCode: '',
    transactionIds: ['930683'],
  },
  {
    id: '310683',
    chainId: 'btc',
    creatorAddressId: '110132',
    createdTimestamp: 1680978100,
    sourceCode: '',
    transactionIds: ['910101', '912299'],
  },
  {
    id: '310992',
    chainId: 'btc',
    creatorAddressId: '112840',
    createdTimestamp: 1690000000,
    sourceCode: '',
    transactionIds: ['913211'],
  },
  {
    id: '311025',
    chainId: 'btc',
    creatorAddressId: '114007',
    createdTimestamp: 1698340041,
    sourceCode: '',
    transactionIds: ['914025'],
  },
  {
    id: '311382',
    chainId: 'btc',
    creatorAddressId: '114007',
    createdTimestamp: 1698321919,
    sourceCode: '',
    transactionIds: ['915024', '918402'],
  },
  {
    id: '311382',
    chainId: 'btc',
    creatorAddressId: '115588',
    createdTimestamp: 1698242391,
    sourceCode: '',
    transactionIds: ['916841'],
  },
  {
    id: '312817',
    chainId: 'btc',
    creatorAddressId: '112840',
    createdTimestamp: 1698243092,
    sourceCode: '',
    transactionIds: ['919298'],
  },
  {
    id: '320062',
    chainId: 'eth',
    creatorAddressId: '120999',
    createdTimestamp: 1694242591,
    sourceCode: '',
    transactionIds: ['919298'],
  },
  {
    id: '320103',
    chainId: 'eth',
    creatorAddressId: '120999',
    createdTimestamp: 1690242391,
    sourceCode: '',
    transactionIds: ['919298'],
  },
  {
    id: '320293',
    chainId: 'eth',
    creatorAddressId: '121700',
    createdTimestamp: 1683822349,
    sourceCode: '',
    transactionIds: ['919298'],
  },
  {
    id: '320592',
    chainId: 'eth',
    creatorAddressId: '123201',
    createdTimestamp: 1682120557,
    sourceCode: '',
    transactionIds: ['923372'],
  },
];
