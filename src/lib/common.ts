import {MONTH_LIST} from '../constants/config';

export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      day: '-',
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
    day: `${dayString}`, // e.g. 01
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
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const roundToDecimal = (x: number, decimal: number) => {
  if (isNaN(x) || x === 0) return '0';
  const toDecimal = 10 ^ decimal;
  return (Math.round(x * toDecimal) / toDecimal).toLocaleString('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
};

export const getChainIcon = (chainId: string) => {
  return {
    src: `/currencies/${chainId}.svg`,
    alt: `${chainId}_icon`,
  };
};

export const getReportTimeSpan = () => {
  const now = new Date().getTime() / 1000;
  const yesterday = now - (now % 86400) - 86400;
  const thirtyDaysAgo = yesterday - 86400 * 30;

  return {
    start: thirtyDaysAgo,
    end: yesterday,
  };
};
