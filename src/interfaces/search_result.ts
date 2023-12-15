import {ISearchType} from '../constants/search_type';
import {IAddress} from './address';
import {IBlock} from './block';
import {IContract} from './contract';
import {IEvidence} from './evidence';
import {IRedFlagDetail} from './red_flag';
import {ITransactionDetail} from './transaction';

export interface ISearchResult {
  type: ISearchType;
  data: IBlock | IAddress | IContract | IEvidence | ITransactionDetail | IRedFlagDetail;
}
