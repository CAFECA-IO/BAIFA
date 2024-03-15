import {IInteractionItem} from './interaction_item';
import {ICommonData} from './common_data';
import {IDisplayTransaction} from './transaction';
import {AddressType} from './address_info';

export interface IContract extends ICommonData {
  contractAddress: string;
}

export interface IContractDetail extends IInteractionItem, IContract {
  transactionHistoryData: IDisplayTransaction[];
  creatorAddressId: string;
  sourceCode: string;
}

export interface IContractBrief extends ICommonData {
  contractAddress: string;
  type: string;
  creatorAddressId: string;
  sourceCode: string;
  publicTag: string[];
}

export const dummyContractDetail: IContractDetail = {
  id: '',
  chainId: '',
  createdTimestamp: 0,
  contractAddress: '',
  transactionHistoryData: [],
  creatorAddressId: '',
  sourceCode: '',
  type: AddressType.CONTRACT,
  transactionCount: 0,
  publicTag: [],
};
