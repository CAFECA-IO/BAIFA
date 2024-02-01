import {ISearchType} from '../constants/search_type';
import {IBlock} from './block';
import {IAddress} from './address';
import {IContract} from './contract';
import {IEvidence} from './evidence';
import {IRedFlagSearchResult} from './red_flag';
import {ITransactionSearchResult} from './transaction';
import {IBlackList} from './blacklist';

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
