import {ICommonData} from './common_data';

export interface IBlackList extends ICommonData {
  address: string;
  tagName: string;
  targetType: string;
  latestActiveTime: number;
}

export interface IBlackListData {
  blacklist: IBlackList[];
  totalPages: number;
}

// export interface IBlackListDetail extends IBlackList {
// }
