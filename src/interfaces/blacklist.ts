import {ICommonData} from '@/interfaces/common_data';

export interface IBlackList extends ICommonData {
  address: string;
  tagName: string;
  targetType: string;
  latestActiveTime: number;
}

export interface IBlackListData {
  blacklist: IBlackList[];
  totalPages: number;
  tagNameOptions: string[];
}

// export interface IBlackListDetail extends IBlackList {
// }
