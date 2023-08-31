export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      monthAndDay: '-',
      year: '-',
      lastYear: '-',
      lastYearDate: '-',
      dateFormatInUS: '-',
      dateFormatForForm: '-',
    };

  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

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

  return {
    date: dateSrting,
    monthAndDay: `${monthNameShort} ${day}`,
    year: `${year}`,
    lastYear: `${year - 1}`,
    lastYearDate: `${monthName} ${day}, ${year - 1}`,
    dateFormatInUS: `${monthName} ${day}, ${year}`,
    dateFormatForForm: `${monthNameShort} ${day}, ${year}`,
  };
};

export const withCommas = (x: number | string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
