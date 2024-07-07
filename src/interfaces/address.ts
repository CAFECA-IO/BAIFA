import {AddressType} from '@/interfaces/address_info';
import {IProducedBlock} from '@/interfaces/block';
import {ICommonData} from '@/interfaces/common_data';
import {IInteractionItem} from '@/interfaces/interaction_item';
import {IReviewDetail} from '@/interfaces/review';
import {ITransactionData} from '@/interfaces/transaction';

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

export interface IAddressRelatedTransaction extends ITransactionData {
  id: string;
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  address: string;
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
  id: 'N/A',
  type: AddressType.ADDRESS,
  address: 'N/A',
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
  transactions: [],
  transactionCount: 0,
  blockData: [],
  flaggingCount: 0,
  riskLevel: 'LOW_RISK',
  publicTag: [],
  blockCount: 0,
  totalPage: 0,
};

export const dummyAddressRelatedTransaction: IAddressRelatedTransaction = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  transactions: [],
  transactionCount: 0,
  totalPage: 0,
};

export const dummyAddressProducedBlock: IAddressProducedBlock = {
  id: '1',
  type: AddressType.ADDRESS,
  address: '0x',
  chainId: '1',
  blockData: [],
  blockCount: 0,
  totalPage: 0,
};
