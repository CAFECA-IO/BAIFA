import {ICommonData} from './common_data';
import {IStabilityLevel, StabilityLevel} from '../constants/stability_level';

export interface IBlock extends ICommonData {
  stability: IStabilityLevel;
}

export interface IBlockBrief extends IBlock {
  miner: string;
  reward: number;
  unit: string;
}

export interface IProductionBlock extends IBlock {
  reward: number;
  unit: string;
}

export interface IProducedBlock {
  blockData: IProductionBlock[];
  blockCount: number;
  totalPage: number;
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

export interface IBlockList {
  blocks: IBlockBrief[];
  totalPages: number;
}

export const dummyBlockDetail: IBlockDetail = {
  id: '',
  chainId: '',
  createdTimestamp: 0,
  stability: StabilityLevel.LOW,
  extraData: '',
  transactionCount: 0,
  miner: '',
  reward: 0,
  unit: '',
  size: 0,
  previousBlockId: '',
  nextBlockId: '',
};
