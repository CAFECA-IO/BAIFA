import {AddressType} from './address_info';
import {ICommonData} from './common_data';

export interface IInteractionItem extends ICommonData {
  // Info: (20240220 - Julian) from ICommonData
  // id: string;
  // chainId: string;
  // createdTimestamp: number;
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  transactionCount: number;
  publicTag: string[];
}

export interface IInteraction extends ICommonData {
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  transactionCount: number;
  redFlagCount: number;
  publicTag: string[];
}

export interface IInteractionList {
  interactedData: IInteraction[];
  totalPages: number;
}
