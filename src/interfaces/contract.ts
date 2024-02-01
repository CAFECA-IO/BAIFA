import {IInteractionItem} from './interaction_item';
import {ICommonData} from './common_data';

export interface IContract extends ICommonData {
  contractAddress: string;
}

export interface IContractDetail extends IInteractionItem, IContract {
  creatorAddressId: string;
  sourceCode: string;
}
