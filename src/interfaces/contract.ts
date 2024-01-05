import {IInteractionItem} from './interaction_item';

export interface IContract extends IInteractionItem {
  contractAddress: string;
  creatorAddressId: string;
  sourceCode: string;
}
