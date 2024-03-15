import {THRESHOLD_FOR_BLOCK_STABILITY} from '../constants/config';
import {RiskLevel} from '../constants/risk_level';
import {StabilityLevel} from '../constants/stability_level';
import {assessAddressRisk, assessBlockStability} from '../lib/common';

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
    expect(assessAddressRisk('not a number')).toBe(RiskLevel.HIGH_RISK);
    expect(assessAddressRisk(NaN)).toBe(RiskLevel.HIGH_RISK);
  });
});

describe('assessBlockStability function test', () => {
  test('returns LOW stability for differences less than MEDIUM threshold', () => {
    expect(assessBlockStability(1, 1)).toBe(StabilityLevel.LOW);
    expect(assessBlockStability(2, 3)).toBe(StabilityLevel.LOW);
    expect(assessBlockStability(10, 15)).toBe(StabilityLevel.LOW);
    expect(assessBlockStability(10, 20)).toBe(StabilityLevel.LOW);
    expect(assessBlockStability(100, 105)).toBe(StabilityLevel.LOW);
  });

  test('returns MEDIUM stability for differences between MEDIUM and HIGH threshold', () => {
    expect(assessBlockStability(1, THRESHOLD_FOR_BLOCK_STABILITY.MEDIUM + 2)).toBe(
      StabilityLevel.MEDIUM
    );
    expect(assessBlockStability(50, THRESHOLD_FOR_BLOCK_STABILITY.MEDIUM + 51)).toBe(
      StabilityLevel.MEDIUM
    );
    expect(assessBlockStability(10, 25)).toBe(StabilityLevel.MEDIUM);
    expect(assessBlockStability(100, 111)).toBe(StabilityLevel.MEDIUM);
    expect(assessBlockStability(100, 120)).toBe(StabilityLevel.MEDIUM);
  });

  test('returns HIGH stability for differences greater than HIGH threshold', () => {
    expect(assessBlockStability(1, THRESHOLD_FOR_BLOCK_STABILITY.HIGH + 2)).toBe(
      StabilityLevel.HIGH
    );
    expect(assessBlockStability(100, THRESHOLD_FOR_BLOCK_STABILITY.HIGH + 101)).toBe(
      StabilityLevel.HIGH
    );
    expect(assessBlockStability(100, 121)).toBe(StabilityLevel.HIGH);
  });

  test('handles invalid input gracefully by treating string inputs as NaN', () => {
    // Convert string inputs to NaN explicitly to handle them as invalid inputs
    const parseInput = (input: number | string) => {
      const number = parseFloat(input as string);
      return isNaN(number) ? NaN : number;
    };

    expect(assessBlockStability(parseInput('not a number'), parseInput(100))).toBe(
      StabilityLevel.LOW
    );
    expect(assessBlockStability(parseInput(100), parseInput('not a number'))).toBe(
      StabilityLevel.LOW
    );
    expect(assessBlockStability(parseInput(NaN), parseInput(NaN))).toBe(StabilityLevel.LOW);
  });
});
