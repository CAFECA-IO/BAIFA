import {AddressType} from './address_info';

export interface IInteractionItem {
  id: string;
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  chainId: string;
  createdTimestamp: number;
  transactionCount: number;
  publicTag: string[];
}
