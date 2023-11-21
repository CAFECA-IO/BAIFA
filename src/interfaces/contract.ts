import {IInteractionItem} from './interaction_item';

export interface IContract extends IInteractionItem {
  contractAddress: string;
  creatorAddressId: string;
  sourceCode: string;
}

export const dummyContractData: IContract[] = [
  {
    id: '330029',
    type: 'contract',
    contractAddress: '0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43',
    chainId: 'isun',
    creatorAddressId: '130008',
    createdTimestamp: 1688341795,
    sourceCode: '',
    transactionIds: ['930032', '931314'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '330071',
    type: 'contract',
    contractAddress: '0x2326a8ee8e96ace42a513a427a1ab5045a684e013',
    chainId: 'isun',
    creatorAddressId: '130294',
    createdTimestamp: 1692322345,
    sourceCode: '',
    transactionIds: ['930071'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '330077',
    type: 'contract',
    contractAddress: '0x226ae8e962a513a427e35585b303179bd53b821b0',
    chainId: 'isun',
    creatorAddressId: '130682',
    createdTimestamp: 1693341175,
    sourceCode: '',
    transactionIds: ['930291', '931302'],
    publicTag: ['TideBit'],
  },
  {
    id: '330291',
    type: 'contract',
    contractAddress: '0x87e7D106FE75fcD26d9aC311EF29ac1398DD4441',
    chainId: 'isun',
    creatorAddressId: '134902',
    createdTimestamp: 1689352395,
    sourceCode: '',
    transactionIds: ['930683'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '310683',
    type: 'contract',
    contractAddress: '0xc0212fe0351589b6ae25ecddaf84517114700315',
    chainId: 'btc',
    creatorAddressId: '110132',
    createdTimestamp: 1680978100,
    sourceCode: '',
    transactionIds: ['910101', '912299'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '310992',
    type: 'contract',
    contractAddress: '0xc41126a5284c61d46f9aa04511476420af4e4517',
    chainId: 'btc',
    creatorAddressId: '112840',
    createdTimestamp: 1690000000,
    sourceCode: '',
    transactionIds: ['913211'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '311025',
    type: 'contract',
    contractAddress: '0x881D40237659C251811CEC9c364ef91dC08D300C',
    chainId: 'btc',
    creatorAddressId: '114007',
    createdTimestamp: 1698340041,
    sourceCode: '',
    transactionIds: ['914025'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '311382',
    type: 'contract',
    contractAddress: '0xb61e1747cb5b2b9ff4a5dd18e625c1b55475d4d5',
    chainId: 'btc',
    creatorAddressId: '114007',
    createdTimestamp: 1698321919,
    sourceCode: '',
    transactionIds: ['915024', '918402'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '311382',
    type: 'contract',
    contractAddress: '0x829a36505e7cabd475d4d55e5299e938e625c1b55',
    chainId: 'btc',
    creatorAddressId: '115588',
    createdTimestamp: 1698242391,
    sourceCode: '',
    transactionIds: ['916841'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '312817',
    type: 'contract',
    contractAddress: '0x7F18BB4Dd92CF2404C54CBa1A9BE4A1153bdb078',
    chainId: 'btc',
    creatorAddressId: '112840',
    createdTimestamp: 1698243092,
    sourceCode: '',
    transactionIds: ['919298'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '320062',
    type: 'contract',
    contractAddress: '0xdc838074D95C89a5C2CbF26984FEDc9160b61620',
    chainId: 'eth',
    creatorAddressId: '120999',
    createdTimestamp: 1694242591,
    sourceCode: '',
    transactionIds: ['919298'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '320103',
    type: 'contract',
    contractAddress: '0x1c836208074D9a5C2CEDc9160b61bF26984F5C89',
    chainId: 'eth',
    creatorAddressId: '120999',
    createdTimestamp: 1690242391,
    sourceCode: '',
    transactionIds: ['919298'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '320293',
    type: 'contract',
    contractAddress: '0x11eDedebF63bef0ea2d2D071bdF88F71543ec6fB',
    chainId: 'eth',
    creatorAddressId: '121700',
    createdTimestamp: 1683822349,
    sourceCode: '',
    transactionIds: ['919298'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '320592',
    type: 'contract',
    contractAddress: '0x74de5d4FCbf63E00296fd95d33236B9794016631',
    chainId: 'eth',
    creatorAddressId: '123201',
    createdTimestamp: 1682120557,
    sourceCode: '',
    transactionIds: ['923372'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '320728',
    type: 'contract',
    contractAddress: '0xC65533271e008Eb66B375Bc4c4fd4b5857dACDeb',
    chainId: 'eth',
    creatorAddressId: '123201',
    createdTimestamp: 1682452309,
    sourceCode: '',
    transactionIds: ['924713', '928728'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '340042',
    type: 'contract',
    contractAddress: '0xC6A18020213A6E66f91769633303AE3c14745ad8',
    chainId: 'usdt',
    creatorAddressId: '140002',
    createdTimestamp: 1687303345,
    sourceCode: '',
    transactionIds: ['940555'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '341938',
    type: 'contract',
    contractAddress: '0x9d9E62B5F6A77541cfbE5773f49eB81a97Db945D',
    chainId: 'usdt',
    creatorAddressId: '140050',
    createdTimestamp: 1685341407,
    sourceCode: '',
    transactionIds: ['940202'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '342001',
    type: 'contract',
    contractAddress: '0x61ed2aD9452f0F062D3B1DaE1BA71fF819A0ccb3',
    chainId: 'usdt',
    creatorAddressId: '140002',
    createdTimestamp: 1687349821,
    sourceCode: '',
    transactionIds: ['940202', '944499'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '343917',
    type: 'contract',
    contractAddress: '0xC6A18020213A6E66f91769633303AE3c14745ad8',
    chainId: 'usdt',
    creatorAddressId: '140333',
    createdTimestamp: 1687449002,
    sourceCode: '',
    transactionIds: ['944777'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '344321',
    type: 'contract',
    contractAddress: '0xa000d675169F839Be026f55dE49Ccdf595e8FC2C',
    chainId: 'usdt',
    creatorAddressId: '144055',
    createdTimestamp: 1687449002,
    sourceCode: '',
    transactionIds: ['945008'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
  {
    id: '345673',
    type: 'contract',
    contractAddress: '0x68607Ab84D3C67Cc54E6810Cc2AD09267f034D18',
    chainId: 'usdt',
    creatorAddressId: '146605',
    createdTimestamp: 1687449002,
    sourceCode: '',
    transactionIds: ['945449'],
    publicTag: ['PUBLIC_TAG.UNKNOWN_USER'],
  },
];
