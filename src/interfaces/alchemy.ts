export interface IAlchemyTransaction {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number | null;
  erc721TokenId: string | null;
  erc1155Metadata: string[] | null;
  tokenId: string | null;
  asset: string | null;
  category: string;
  rawContract: {
    value: string;
    address: string | null;
    decimal: string;
  };
  metadata: {
    blockTimestamp: string;
  };
}

export interface IAlchemyTransactionResponse {
  transfers: IAlchemyTransaction[];
  pageKey: string;
}
