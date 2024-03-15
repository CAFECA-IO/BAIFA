interface ITransactionType {
  [key: string]: string;
}

export const TransactionType: ITransactionType = {
  'Normal': 'CHAIN_DETAIL_PAGE.TYPE_NORMAL',
  'Create contract': 'CHAIN_DETAIL_PAGE.TYPE_CONTRACT',
  'ERC-20': 'CHAIN_DETAIL_PAGE.TYPE_ERC',
  'NFT': 'CHAIN_DETAIL_PAGE.TYPE_NFT',
  'Evidence': 'CHAIN_DETAIL_PAGE.TYPE_EVIDENCE',
};

export const DefaultTransactionType = 'CHAIN_DETAIL_PAGE.TYPE_NORMAL';
