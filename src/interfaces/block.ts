import {ICommonData} from './common_data';
import {IStabilityLevel} from '../constants/stability_level';

export interface IBlock extends ICommonData {
  stability: IStabilityLevel;
}

export interface IProductionBlock extends IBlock {
  reward: number;
  unit: string;
}

export interface IBlockDetail extends IBlock {
  extraData: string; // ToDo: (20240205 - Julian) 可能為 Hexs
  transactionCount: number;
  miner: string;
  reward: number;
  unit: string;
  size: number;
  previousBlockId?: string;
  nextBlockId?: string;
}
