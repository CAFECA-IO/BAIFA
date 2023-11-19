export type ISearchType =
  | 'BLOCK'
  | 'ADDRESS'
  | 'CONTRACT'
  | 'EVIDENCE'
  | 'TRANSACTION'
  | 'BLACK_LIST'
  | 'RED_FLAG';

export type ISearchTypeConstant = {
  BLOCK: ISearchType;
  ADDRESS: ISearchType;
  CONTRACT: ISearchType;
  EVIDENCE: ISearchType;
  TRANSACTION: ISearchType;
  BLACK_LIST: ISearchType;
  RED_FLAG: ISearchType;
};

export const SearchType: ISearchTypeConstant = {
  BLOCK: 'BLOCK',
  ADDRESS: 'ADDRESS',
  CONTRACT: 'CONTRACT',
  EVIDENCE: 'EVIDENCE',
  TRANSACTION: 'TRANSACTION',
  BLACK_LIST: 'BLACK_LIST',
  RED_FLAG: 'RED_FLAG',
};
