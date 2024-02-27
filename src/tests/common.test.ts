import {RiskLevel} from '../constants/risk_level';
import {assessAddressRisk} from '../lib/common';

describe('assessAddressRisk function test', () => {
  test('returns LOW_RISK for values less than 10', () => {
    expect(assessAddressRisk(9)).toBe(RiskLevel.LOW_RISK);
    expect(assessAddressRisk('5')).toBe(RiskLevel.LOW_RISK);
  });

  test('returns MEDIUM_RISK for values between 10 and 100 inclusive', () => {
    expect(assessAddressRisk(10)).toBe(RiskLevel.MEDIUM_RISK);
    expect(assessAddressRisk('50')).toBe(RiskLevel.MEDIUM_RISK);
    expect(assessAddressRisk(100)).toBe(RiskLevel.MEDIUM_RISK);
  });

  test('returns HIGH_RISK for values greater than 100', () => {
    expect(assessAddressRisk(101)).toBe(RiskLevel.HIGH_RISK);
    expect(assessAddressRisk('150')).toBe(RiskLevel.HIGH_RISK);
  });

  test('handles invalid input gracefully', () => {
    // Since the actual function logs an error and returns HIGH_RISK for invalid input,
    // we test for HIGH_RISK. Adjust based on actual desired behavior.
    expect(assessAddressRisk('not a number')).toBe(RiskLevel.HIGH_RISK);
    expect(assessAddressRisk(NaN)).toBe(RiskLevel.HIGH_RISK);
  });
});
