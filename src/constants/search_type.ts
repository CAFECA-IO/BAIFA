export type ISearchType =
  | 'ALL'
  | 'BLOCK'
  | 'ADDRESS'
  | 'CONTRACT'
  | 'EVIDENCE'
  | 'TRANSACTION'
  | 'BLACKLIST'
  | 'RED_FLAG';

export type ISearchTypeConstant = {
  ALL: ISearchType;
  BLOCK: ISearchType;
  ADDRESS: ISearchType;
  CONTRACT: ISearchType;
  EVIDENCE: ISearchType;
  TRANSACTION: ISearchType;
  BLACKLIST: ISearchType;
  RED_FLAG: ISearchType;
};

export const SearchType: ISearchTypeConstant = {
  ALL: 'ALL',
  BLOCK: 'BLOCK',
  ADDRESS: 'ADDRESS',
  CONTRACT: 'CONTRACT',
  EVIDENCE: 'EVIDENCE',
  TRANSACTION: 'TRANSACTION',
  BLACKLIST: 'BLACKLIST',
  RED_FLAG: 'RED_FLAG',
};

export function isSearchType(param: any): param is ISearchType {
  return Object.values(SearchType).includes(param);
}
