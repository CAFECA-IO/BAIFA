import {IInteractionItem} from './interaction_item';
import {ICommonData} from './common_data';
import {ITransaction} from './transaction';

export interface IContract extends ICommonData {
  contractAddress: string;
}

export interface IContractDetail extends IInteractionItem, IContract {
  transactionHistoryData: ITransaction[];
  creatorAddressId: string;
  sourceCode: string;
}
