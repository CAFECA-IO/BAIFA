export interface IInteractionItem {
  id: string;
  type: 'address' | 'contract';
  chainId: string;
  transactionIds: string[];
  publicTag: string[];
}
