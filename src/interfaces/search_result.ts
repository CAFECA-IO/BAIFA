import {ISearchType, SearchType} from '@/constants/search_type';
import {IBlock} from '@/interfaces/block';
import {IAddress} from '@/interfaces/address';
import {IContract} from '@/interfaces/contract';
import {IEvidence} from '@/interfaces/evidence';
import {IRedFlagSearchResult} from '@/interfaces/red_flag';
import {ITransactionSearchResult} from '@/interfaces/transaction';
import {IBlackList} from '@/interfaces/blacklist';

export interface ISearchResult {
  type: ISearchType;
  data:
    | IBlock
    | IAddress
    | IContract
    | IEvidence
    | ITransactionSearchResult
    | IRedFlagSearchResult
    | IBlackList;
}

export interface ISearchResultData {
  type: ISearchType;

  count: number;
  totalPage: number;
  data: ISearchResult[];
}

export const filterTabs = [
  'SEARCHING_RESULT_PAGE.ALL_TAB', // Info:(20231228 - Julian) All
  'SEARCHING_RESULT_PAGE.BLOCKS_TAB', // Info:(20231228 - Julian) Blocks
  'SEARCHING_RESULT_PAGE.ADDRESSES_TAB', // Info:(20231228 - Julian) Addresses
  'SEARCHING_RESULT_PAGE.CONTRACTS_TAB', // Info:(20231228 - Julian) Contracts
  'SEARCHING_RESULT_PAGE.EVIDENCES_TAB', // Info:(20231228 - Julian) Evidences
  'SEARCHING_RESULT_PAGE.TRANSACTIONS_TAB', // Info:(20231228 - Julian) Transactions
  'SEARCHING_RESULT_PAGE.BLACKLIST_TAB', // Info:(20231228 - Julian) Black List
  'SEARCHING_RESULT_PAGE.RED_FLAGS_TAB', // Info:(20231228 - Julian) Red Flags
];

export const filterTabsToSearchType = new Map([
  ['SEARCHING_RESULT_PAGE.ALL_TAB', SearchType.ALL],
  ['SEARCHING_RESULT_PAGE.BLOCKS_TAB', SearchType.BLOCK],
  ['SEARCHING_RESULT_PAGE.ADDRESSES_TAB', SearchType.ADDRESS],
  ['SEARCHING_RESULT_PAGE.CONTRACTS_TAB', SearchType.CONTRACT],
  ['SEARCHING_RESULT_PAGE.EVIDENCES_TAB', SearchType.EVIDENCE],
  ['SEARCHING_RESULT_PAGE.TRANSACTIONS_TAB', SearchType.TRANSACTION],
  ['SEARCHING_RESULT_PAGE.BLACKLIST_TAB', SearchType.BLACKLIST],
  ['SEARCHING_RESULT_PAGE.RED_FLAGS_TAB', SearchType.RED_FLAG],
]);

export const searchTypeToFilterTabs = new Map([
  [SearchType.ALL, 'SEARCHING_RESULT_PAGE.ALL_TAB'],
  [SearchType.BLOCK, 'SEARCHING_RESULT_PAGE.BLOCKS_TAB'],
  [SearchType.ADDRESS, 'SEARCHING_RESULT_PAGE.ADDRESSES_TAB'],
  [SearchType.CONTRACT, 'SEARCHING_RESULT_PAGE.CONTRACTS_TAB'],
  [SearchType.EVIDENCE, 'SEARCHING_RESULT_PAGE.EVIDENCES_TAB'],
  [SearchType.TRANSACTION, 'SEARCHING_RESULT_PAGE.TRANSACTIONS_TAB'],
  [SearchType.BLACKLIST, 'SEARCHING_RESULT_PAGE.BLACKLIST_TAB'],
  [SearchType.RED_FLAG, 'SEARCHING_RESULT_PAGE.RED_FLAGS_TAB'],
]);
