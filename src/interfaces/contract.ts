import {ICommonData} from './common_data';

export interface IContract extends ICommonData {
  contractAddress: string;
}

export interface IContractDetail extends IContract {
  type: string;
  creatorAddressId: string;
  sourceCode: string;
  publicTag: string[];
}
