export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      monthAndDay: '-',
      year: '-',
      dateFormatInUS: '-',
    };

  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const monthIndex = date.getMonth();
  const monthNames = [
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

  const monthName = monthNames[monthIndex];

  return {
    date: `${year}-${month}-${day}`,
    monthAndDay: `${monthName} ${day}`,
    year: `${year}`,
    dateFormatInUS: `${monthName} ${day}, ${year}`,
  };
};
