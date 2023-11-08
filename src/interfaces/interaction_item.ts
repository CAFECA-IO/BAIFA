export interface IInteractionItem {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  createdTimestamp: number;
  transactionIds: string[];
  publicTag: string[];
}
