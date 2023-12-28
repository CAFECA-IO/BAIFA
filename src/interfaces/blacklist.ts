import {IRedFlagType} from '../constants/red_flag_type';

export interface IBlacklist {
  id: string;
  chainId: string;
  latestActiveTime: number;
  flaggingRecords: IRedFlagType[];
  publicTag: string[];
}
