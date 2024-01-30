import {IStabilityLevel} from '../constants/stability_level';

export interface IBlock {
  id: string;
  chainId: string;
  stability: IStabilityLevel;
  createdTimestamp: number;
}

export interface IProductionBlock extends IBlock {
  reward: number;
  unit: string;
}

export interface IBlockDetail extends IBlock {
  managementTeam: string[];
  transactionCount: number;
  miner: string;
  reward: number;
  unit: string;
  size: number;
  previousBlockId?: string;
  nextBlockId?: string;
}
