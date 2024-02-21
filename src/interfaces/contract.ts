import {IInteractionItem} from './interaction_item';
import {ICommonData} from './common_data';
import {IDisplayTransaction} from './transaction';

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
