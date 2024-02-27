import {IPaginationOptions, SortingType} from '../constants/api_request';
import {
  DEFAULT_CHAIN_ICON,
  DEFAULT_CURRENCY_ICON,
  MAX_64_BIT_INTEGER_PARAMETER,
  MILLISECONDS_IN_A_SECOND,
  MIN_64_BIT_INTEGER_PARAMETER,
  MONTH_LIST,
  sortOldAndNewOptions,
  THRESHOLD_FOR_ADDRESS_RISK_LEVEL,
  THRESHOLD_FOR_BLOCK_STABILITY,
} from '../constants/config';
import {StabilityLevel} from '../constants/stability_level';
import clsx from 'clsx';
import type {ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {AddressType} from '../interfaces/address_info';
import {IRiskLevel, RiskLevel} from '../constants/risk_level';

export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      dateOfLastYear: '-',
      day: '-',
      tomorrow: '-',
      month: '-',
      monthAndDay: '-',
      monthFullName: '-',
      year: '-',
      lastYear: '-',
      lastYearDate: '-',
      dateFormatInUS: '-',
      dateFormatForForm: '-',
      time: '-',
    };

  const date = new Date(timestamp * 1000);
  // 設定時區
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  const second = `${date.getSeconds()}`.padStart(2, '0');

  const monthIndex = date.getMonth();
  const monthNamesInShort = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ];

  const monthFullName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthNameShort = monthNamesInShort[monthIndex];
  const monthName = monthFullName[monthIndex];
  const dateSrting = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  const dayString = `${day.toString().padStart(2, '0')}`;
  const monthString = MONTH_LIST[monthIndex];

  return {
    date: dateSrting, // e.g. 2021-01-01
    dateOfLastYear: `${year - 1}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`, // e.g. 2020-01-01
    day: `${dayString}`, // e.g. 01
    tomorrow: `${year}-${month.toString().padStart(2, '0')}-${(day + 1)
      .toString()
      .padStart(2, '0')}`, // e.g. 2021-01-02
    month: `${monthString}`, // e.g. January (with i18n)
    monthFullName: `${monthName}`, // e.g. January
    monthAndDay: `${monthNameShort} ${day}`, // e.g. Jan. 01
    year: `${year}`, // e.g. 2021
    lastYear: `${year - 1}`, // e.g. 2020
    lastYearDate: `${monthName} ${day}, ${year - 1}`, // e.g. Jan. 01, 2020
    dateFormatInUS: `${monthName} ${day}, ${year}`, // e.g. Jan. 01, 2021
    dateFormatForForm: `${monthNameShort} ${day}, ${year}`, // e.g. Jan. 01, 2021
    time: `${hour}:${minute}:${second}`, // e.g. 00:00:00
  };
};

export const getTimeString = (timeSpan: number) => {
  const time = Math.ceil(timeSpan);

  if (time >= 360000) {
    const day = Math.floor(time / 86400);
    return `${day}D`;
  }

  if (time < 60) return `${time}s`;
  if (time >= 60 && time < 3600) {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}m ${sec}s`;
  }
  if (time >= 3600 && time < 86400) {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}h ${min}m ${sec}s`;
  }
  if (time >= 86400) {
    const day = Math.floor(time / 86400);
    const hour = Math.floor((time % 86400) / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${day}D ${hour}h ${min}m ${sec}s`;
  }
};

export const withCommas = (x: number | string) => {
  // Info: (20231214 - Julian) 如果 x 為 NaN 或 undefined 或 null，顯示 '—'
  if (x === undefined || x === null || isNaN(Number(x))) return '—';

  // Info: (20240219 - Julian) 將整數和小數分開處理
  const int = Math.floor(Number(x));
  const dec = Number(x) - int;

  // Info: (20240219 - Julian) 整數 -> 加上千分位逗點
  const intStr = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // Info: (20240219 - Julian) 小數 -> 去掉小數點前面的 0
  const decStr = dec.toString().replace(/^0+/, '');

  // Info: (20240219 - Julian) 回傳組合後的字串
  return intStr + decStr;
};

export const truncateText = (text: string | undefined, length: number) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};

export const roundToDecimal = (x: number, decimal: number) => {
  // Info: (20231214 - Julian) 如果 x 為 NaN 或 undefined 或 null，顯示 '—'
  // Info: (20231214 - Julian) 如果 x 為 0 就直接回傳 '0'
  if (x === undefined || x === null || isNaN(x)) return '—';
  if (x === 0 || x.toString() === '0') return '0';

  const toDecimal = 10 ** decimal;
  const result = Math.round(x * toDecimal) / toDecimal;
  return result.toLocaleString('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
};

export const getChainIcon = (chainId: string) => {
  // Info: (20240206 - Julian) 如果沒有 chainId，就顯示 default_chain.svg
  if (!chainId) return {src: DEFAULT_CHAIN_ICON, alt: 'chain_icon'};

  return {
    src: `/chains/${chainId}.svg`,
    alt: `chain_icon`,
  };
};

export const getCurrencyIcon = (currencyId: string) => {
  // Info: (20240206 - Julian) 如果沒有 currencyId，就顯示 default_currency.svg
  if (!currencyId) return {src: DEFAULT_CURRENCY_ICON, alt: 'currency_icon'};
  return {
    src: `/currencies/${currencyId}.svg`,
    alt: `currency_icon`,
  };
};

export const getUnit = (chainId: string) => {
  const dummyCurrencyData = [
    {currencyId: 'btc', currencyName: 'Bitcoin', unit: 'BTC'},
    {currencyId: 'eth', currencyName: 'Ethereum', unit: 'ETH'},
    {currencyId: 'isun', currencyName: 'iSunCloud', unit: 'BOLT'},
    {currencyId: 'usdt', currencyName: 'Tether', unit: 'USDT'},
    {currencyId: 'bnb', currencyName: 'Binace Coin', unit: 'BNB'},
  ];

  return dummyCurrencyData.find(currency => currency.currencyId === chainId)?.unit ?? '';
};

export const getReportTimeSpan = () => {
  const now = new Date().getTime() / 1000;
  const yesterday = now - (now % 86400) - 86400;
  const thirtyDaysAgo = yesterday - 86400 * 29;

  return {
    start: thirtyDaysAgo,
    end: yesterday,
  };
};

export const getChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return (current - previous) / previous;
};

// Info: 確認 input 在 javascript 有效的 64-bit 範圍內 (20240201 - Shirley)
export function isValid64BitInteger(input: string | number | bigint) {
  const MAX_64BIT_INT = BigInt(MAX_64_BIT_INTEGER_PARAMETER);
  const MIN_64BIT_INT = BigInt(MIN_64_BIT_INTEGER_PARAMETER);

  let num;

  try {
    num = BigInt(input);
  } catch (e) {
    // Info: 如果 input 不能轉換為 BigInt (20240201 - Shirley)
    return false;
  }

  return num >= MIN_64BIT_INT && num <= MAX_64BIT_INT;
}

// Info: 藉由 targetBlockId 跟 latestBlockId 計算區塊的穩定度，越新的 block ，穩定性越低 (20240201 - Shirley)
export const assessBlockStability = (targetBlockId: number, latestBlockId: number) => {
  let stability = StabilityLevel.LOW;
  if (isNaN(+targetBlockId) || isNaN(+latestBlockId)) return stability;

  if (THRESHOLD_FOR_BLOCK_STABILITY.HIGH < Math.abs(latestBlockId - targetBlockId)) {
    stability = StabilityLevel.HIGH;
  } else if (THRESHOLD_FOR_BLOCK_STABILITY.MEDIUM < Math.abs(latestBlockId - targetBlockId)) {
    stability = StabilityLevel.MEDIUM;
  } else if (Math.abs(latestBlockId - latestBlockId) < THRESHOLD_FOR_BLOCK_STABILITY.MEDIUM) {
    stability = StabilityLevel.LOW;
  }

  return stability;
};

export function convertStringToSortingType(sorting: string): IPaginationOptions['order'] {
  let order: IPaginationOptions['order'] = SortingType.DESC;
  switch (sorting) {
    case sortOldAndNewOptions[0]:
      order = SortingType.DESC;
      break;
    case sortOldAndNewOptions[1]:
      order = SortingType.ASC;
      break;
    default:
      order = SortingType.ASC;
      break;
  }

  return order;
}

export function convertSortingTypeToString(sorting: IPaginationOptions['order']): string {
  let order = sortOldAndNewOptions[0];
  switch (sorting) {
    case SortingType.DESC:
      order = sortOldAndNewOptions[0];
      break;
    case SortingType.ASC:
      order = sortOldAndNewOptions[1];
    default:
      order = sortOldAndNewOptions[0];
      break;
  }

  return order;
}

export function convertMillisecondsToSeconds(milliseconds: number) {
  return Math.floor(milliseconds / MILLISECONDS_IN_A_SECOND);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertStringToAddressType(sorting: string): AddressType {
  let addressType: AddressType = AddressType.ADDRESS;
  switch (sorting) {
    case 'address':
      addressType = AddressType.ADDRESS;
      break;
    case 'contract':
      addressType = AddressType.CONTRACT;
      break;
    default:
      addressType = AddressType.ADDRESS;
      break;
  }

  return addressType;
}

export function convertAddressTypeToString(addressType: AddressType): string {
  let type = 'address';
  switch (addressType) {
    case AddressType.ADDRESS:
      type = 'address';
      break;
    case AddressType.CONTRACT:
      type = 'contract';
      break;
    default:
      type = 'address';
      break;
  }

  return type;
}

export function assessAddressRisk(input: number | string): IRiskLevel {
  const value = typeof input === 'string' ? parseFloat(input) : input;
  let result = RiskLevel.HIGH_RISK;

  if (isNaN(value)) {
    return result;
  }

  if (value < THRESHOLD_FOR_ADDRESS_RISK_LEVEL.LOW) {
    result = RiskLevel.LOW_RISK;
  } else if (value <= THRESHOLD_FOR_ADDRESS_RISK_LEVEL.HIGH) {
    result = RiskLevel.MEDIUM_RISK;
  } else if (value > THRESHOLD_FOR_ADDRESS_RISK_LEVEL.HIGH) {
    result = RiskLevel.HIGH_RISK;
  }

  return result;
}
