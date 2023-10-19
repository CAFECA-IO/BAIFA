export type IRiskLevel = 'MEDIUM_RISK' | 'HIGH_RISK' | 'LOW_RISK';

export type IRiskLevelConstant = {
  MEDIUM_RISK: IRiskLevel;
  HIGH_RISK: IRiskLevel;
  LOW_RISK: IRiskLevel;
};

export const RiskLevel: IRiskLevelConstant = {
  MEDIUM_RISK: 'MEDIUM_RISK',
  HIGH_RISK: 'HIGH_RISK',
  LOW_RISK: 'LOW_RISK',
};
