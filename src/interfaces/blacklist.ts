import {IRedFlagType} from '../constants/red_flag_type';
import {ICommonData} from './common_data';

export interface IBlacklist extends ICommonData {
  address: string;
  publicTag: string[];
}

export interface IBlacklistDetail extends IBlacklist {
  latestActiveTime: number;
  flaggingRecords: IRedFlagType[];
  publicTag: string[];
}
