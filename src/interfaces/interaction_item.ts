export interface IInteractionItem {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  createdTimestamp: number;
  transactionCount: number;
  publicTag: string[];
}
