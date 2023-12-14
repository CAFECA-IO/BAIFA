import {IRedFlagType, RedFlagType} from '../constants/red_flag_type';

export interface IRedFlag {
  id: string;
  chainId: string;
  addressId: string;
  address: string;
  redFlagType: IRedFlagType;
  createdTimestamp: number; // 被警示的日期
  interactedAddressCount: string[]; // 被警示交易的交易對象
  totalAmount: number; // 交易總金額
  transactionIds: string[]; // 被警示的交易記錄
}

export const getDummyRedFlag = (
  chainId: string,
  addressId: string,
  flagingTimes: number
): IRedFlag[] => {
  const result: IRedFlag[] = [];

  for (let i = 0; i < flagingTimes; i++) {
    const id = i < 10 ? `${addressId}-00${i}` : `${addressId}-0${i}`;
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
    const createdTimestamp = 1689230832 - i * 100000;

    const redFlag: IRedFlag = {
      id: id,
      chainId: chainId,
      addressId: addressId,
      address: '0x000000',
      redFlagType: redFlagType,
      createdTimestamp: createdTimestamp,
      interactedAddressCount: [
        '123201',
        '120999',
        '113992',
        '144055',
        '130682',
        '140002',
        '140007',
        '140333',
      ],
      totalAmount: 100,
      transactionIds: ['931302', '912299', '918402', '924713', '928728', '941749'],
    };
    result.push(redFlag);
  }

  return result;
};
