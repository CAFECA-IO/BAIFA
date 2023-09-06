export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      day: '-',
      month: '-',
      monthAndDay: '-',
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
  const monthNameFull = [
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
  const monthName = monthNameFull[monthIndex];
  const dateSrting = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  const dayString = `${day.toString().padStart(2, '0')}`;

  return {
    date: dateSrting,
    day: `${dayString}`,
    month: `${monthNameShort}`,
    monthAndDay: `${monthNameShort} ${day}`,
    year: `${year}`,
    lastYear: `${year - 1}`,
    lastYearDate: `${monthName} ${day}, ${year - 1}`,
    dateFormatInUS: `${monthName} ${day}, ${year}`,
    dateFormatForForm: `${monthNameShort} ${day}, ${year}`,
    time: `${hour}:${minute}:${second}`,
  };
};

export const withCommas = (x: number | string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
