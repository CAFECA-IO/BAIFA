export type ISearchType =
  | 'BLOCK'
  | 'ADDRESS'
  | 'CONTRACT'
  | 'EVIDENCE'
  | 'TRANSACTION'
  | 'BLACKLIST'
  | 'RED_FLAG';

export type ISearchTypeConstant = {
  BLOCK: ISearchType;
  ADDRESS: ISearchType;
  CONTRACT: ISearchType;
  EVIDENCE: ISearchType;
  TRANSACTION: ISearchType;
  BLACKLIST: ISearchType;
  RED_FLAG: ISearchType;
};

export const SearchType: ISearchTypeConstant = {
  BLOCK: 'BLOCK',
  ADDRESS: 'ADDRESS',
  CONTRACT: 'CONTRACT',
  EVIDENCE: 'EVIDENCE',
  TRANSACTION: 'TRANSACTION',
  BLACKLIST: 'BLACKLIST',
  RED_FLAG: 'RED_FLAG',
};
