export type IStabilityLevel = 'MEDIUM' | 'HIGH' | 'LOW';

export type IStabilityLevelConstant = {
  MEDIUM: IStabilityLevel;
  HIGH: IStabilityLevel;
  LOW: IStabilityLevel;
};

export const StabilityLevel: IStabilityLevelConstant = {
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  LOW: 'LOW',
};
