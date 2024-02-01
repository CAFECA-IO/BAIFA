import {ISearchType} from '../constants/search_type';
import {IBlock} from './block';
import {IAddress} from './address';
import {IContract} from './contract';
import {IEvidence} from './evidence';

export interface ISearchResult {
  type: ISearchType;
  data: IBlock | IAddress | IContract | IEvidence;
  //| ISearchTransaction
  //| ISearchRedFlag
  //| ISearchBlacklist;
}
