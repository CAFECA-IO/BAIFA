/*eslint-disable no-console */

import {AddressType} from './address_info';
import {IProductionBlock} from './block';
import {ICommonData} from './common_data';
import {IInteractionItem} from './interaction_item';
import {IReviewDetail} from './review';
import {ITransaction} from './transaction';

export interface IAddress extends ICommonData {
  address: string;
  flaggingCount: number;
  riskLevel: string;
}

export interface IAddressBrief extends IAddress {
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  latestActiveTime: number;
  score: number;
  interactedAddressCount: number;
  interactedContactCount: number;
  publicTag: string[];
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
}

export interface IAddressRelatedTransaction {
  id: string;
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  address: string;
  // chainId: string;
  // interactedAddressCount: number;
  // interactedContactCount: number;
  transactionHistoryData: ITransaction[];
}

export interface IAddressProducedBlock {
  id: string;
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  address: string;
  chainId: string;
  blockProducedData: IProductionBlock[];
  blockCount: number;
}

// export interface IAddressDetail extends IInteractionItem, IAddress {
//   latestActiveTime: number;
//   //relatedAddresses: {id: string; chainId: string}[]; // ToDo: (20240201 - Julian) 可能移除
//   interactedAddressCount: number;
//   interactedContactCount: number;
//   balance?: number;
//   totalSent?: number;
//   totalReceived?: number;
//   blockProducedData: IProductionBlock[];
//   transactionHistoryData: ITransaction[];
//   score: number;
//   reviewData: IReviewDetail[];
// }

export interface IAddressDetail
  extends IAddressBrief,
    IAddressRelatedTransaction,
    IAddressProducedBlock,
    IInteractionItem,
    IAddress {
  //relatedAddresses: {id: string; chainId: string}[]; // ToDo: (20240201 - Julian) 可能移除
  balance?: number;
  totalSent?: number;
  totalReceived?: number;
  reviewData: IReviewDetail[];
}

export const dummyAddressBrief: IAddressBrief = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  chainId: '1',
  createdTimestamp: 0,
  latestActiveTime: 0,
  score: 0,
  flaggingCount: 0,
  riskLevel: 'LOW_RISK',
  interactedAddressCount: 0,
  interactedContactCount: 0,
  publicTag: [],
};

export const dummyAddress: IAddressDetail = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  chainId: '1',
  createdTimestamp: 0,
  latestActiveTime: 0,
  interactedAddressCount: 0,
  interactedContactCount: 0,
  score: 0,
  reviewData: [],
  transactionHistoryData: [],
  transactionCount: 0,
  blockProducedData: [],
  flaggingCount: 0,
  riskLevel: 'LOW_RISK',
  publicTag: [],
  blockCount: 0,
};

export const dummyAddressRelatedTransaction: IAddressRelatedTransaction = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  // chainId: '1',
  // interactedAddressCount: 0,
  // interactedContactCount: 0,
  transactionHistoryData: [],
};

export const dummyAddressProducedBlock: IAddressProducedBlock = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  chainId: '1',
  blockProducedData: [],
  blockCount: 0,
};
