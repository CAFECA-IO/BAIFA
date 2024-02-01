import {IRedFlagType} from '../constants/red_flag_type';
import {ICommonData} from './common_data';

export interface IBlackList extends ICommonData {
  address: string;
  publicTag: string[];
}

export interface IBlackListDetail extends IBlackList {
  latestActiveTime: number;
  flaggingRecords: IRedFlagType[];
}
