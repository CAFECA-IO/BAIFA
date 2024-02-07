import {AddressType} from './address_info';
import {IProducedBlock, IProductionBlock} from './block';
import {ICommonData} from './common_data';
import {IInteractionItem} from './interaction_item';
import {IReviewDetail} from './review';
import {IDisplayTransaction, ITransaction} from './transaction';

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
  transactionHistoryData: ITransaction[];
}

export interface IAddressProducedBlock extends IProducedBlock {
  id: string;
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  address: string;
  chainId: string;
}

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
  blockData: [],
  flaggingCount: 0,
  riskLevel: 'LOW_RISK',
  publicTag: [],
  blockCount: 0,
};

export const dummyAddressRelatedTransaction: IAddressRelatedTransaction = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  transactionHistoryData: [],
};

export const dummyAddressProducedBlock: IAddressProducedBlock = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  chainId: '1',
  blockData: [],
  blockCount: 0,
};
