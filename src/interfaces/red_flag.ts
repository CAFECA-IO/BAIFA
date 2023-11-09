import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';

export interface IRedFlag {
  id: string;
  chainId: string;
  addressId: string;
  addressHash: string;
  redFlagType: IRedFlagType;
  flaggingTimestamp: number;
  interactedAddressIds: string[];
  totalAmount: number;
  transactionIds: string[];
}

export const getDummyRedFlag = (
  chainId: string,
  addressId: string,
  flagingTimes: number
): IRedFlag[] => {
  let result: IRedFlag[] = [];

  for (let i = 0; i < flagingTimes; i++) {
    const id = i < 10 ? `flag-0000000${i}` : `flag-000000${i}`;
    const redFlagType =
      i % 7 === 0
        ? RedFlagType.LARGE_DEPOSIT
        : i % 7 === 1
        ? RedFlagType.LARGE_WITHDRAW
        : i % 7 === 2
        ? RedFlagType.MULTIPLE_TRANSFER
        : i % 7 === 3
        ? RedFlagType.PRIVACY_COINS
        : i % 7 === 4
        ? RedFlagType.MULTIPLE_WITHDRAW
        : i % 7 === 5
        ? RedFlagType.MIXING_SERVICE
        : i % 7 === 6
        ? RedFlagType.HIGH_RISK_LOCATION
        : RedFlagType.GAMBLING_SITE;
    const flaggingTimestamp = 1689230832 - i * 100000;

    const redFlag: IRedFlag = {
      id: id,
      chainId: chainId,
      addressId: addressId,
      addressHash: '0x000000',
      redFlagType: redFlagType,
      flaggingTimestamp: flaggingTimestamp,
      interactedAddressIds: ['123201', '120999', '113992', '130682'],
      totalAmount: 100,
      transactionIds: ['931302', '912299', '918402'],
    };
    result.push(redFlag);
  }

  return result;
};
