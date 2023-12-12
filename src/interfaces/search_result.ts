import {ISearchType, SearchType} from '../constants/search_type';
import {IAddress, dummyAddressData, dummyBlacklistAddressData} from './address';
import {IBlock, dummyBlockData} from './block';
import {IContract, dummyContractData} from './contract';
import {IEvidence, dummyEvidenceData} from './evidence';
import {IRedFlag, getDummyRedFlag} from './red_flag';
import {ITransaction, dummyTransactionData} from './transaction';

export interface ISearchResult {
  type: ISearchType;
  data: IBlock | IAddress | IContract | IEvidence | ITransaction | IRedFlag;
}

export const dummySearchResult: ISearchResult[] = [
  ...dummyBlockData.map(block => ({type: SearchType.BLOCK, data: block})),
  ...dummyAddressData.map(address => ({type: SearchType.ADDRESS, data: address})),
  ...dummyContractData.map(contract => ({type: SearchType.CONTRACT, data: contract})),
  ...dummyEvidenceData.map(evidence => ({type: SearchType.EVIDENCE, data: evidence})),
  ...dummyTransactionData.map(transaction => ({type: SearchType.TRANSACTION, data: transaction})),
  ...getDummyRedFlag('btc', '0x278432201', 10).map(redFlag => ({
    type: SearchType.RED_FLAG,
    data: redFlag,
  })),
  ...dummyBlacklistAddressData.map(address => ({type: SearchType.BLACKLIST, data: address})),
];
