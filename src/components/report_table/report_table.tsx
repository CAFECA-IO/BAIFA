// ToDo: (20230802 - Julian) 整理 interface
const testTable = {
  thead: ['$ in Thousands', 'Jul. 30, 2023', 'Jul. 1, 2023'],
  tbody: [
    {
      title: 'Customer custodial funds',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Total customer assets',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Customer custodial cash liabilities',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Total customer liaiblities',
      items: ['$ 24278.3', '$ 24467.11'],
    },
  ],
};

const testTable2 = {
  thead: ['$ in Thousands', '*-*', 'Jul. 30, 2023', '*-*', 'Jul. 1, 2023'],
  tbody: [
    {
      title: '',
      items: ['Fair Value', 'Percentage of Total', 'Fair Value', 'Percentage of Total'],
    },
    {
      title: 'Bitcoin',
      items: ['-', '-', '-', '-'],
    },
    {
      title: 'Ethereum',
      items: ['-', '-', '-', '-'],
    },
    {
      title: 'USDT',
      items: ['$ 24278.3', '100%', '$ 24467.11', '100%'],
    },
    {
      title: 'Total customer liaiblities',
      items: ['$ 24278.3', '100%', '$ 24467.11', '100%'],
    },
  ],
};

const ReportTable = () => {
  const th = (
    <tr>
      <th className="py-10px">$ in Thousands</th>
      <th className="py-10px" colSpan={2}>
        Jul. 30, 2023
      </th>
      <th className="py-10px" colSpan={2}>
        Jul. 1, 2023
      </th>
    </tr>
  );

  const displayTh = testTable2.thead.map((item, index) => {
    // ToDo (20230802 - Julian) 處理 *-* 的 colSpan
    const colSpan = testTable2.thead[index - 1] === '*-*' ? 1 : 0;

    if (item === '*-*') return null;
    return (
      <th key={index} colSpan={1 + colSpan} className="py-10px">
        {item}
      </th>
    );
  });

  const displayTbody = testTable2.tbody.map((row, index) => {
    const rowStyle = row.title.includes('Total') ? 'bg-lilac2 font-bold' : '';
    const titleColor = row.title.includes('Total') ? 'text-darkPurple3' : 'text-lilac';

    return (
      <tr key={index} className={`border-x border-b border-black text-darkPurple3 ${rowStyle}`}>
        <td className={`p-5px ${titleColor}`}>{row.title}</td>

        {row.items.map((item, index) => {
          const itemStyle =
            !!item.match(/[0-9]/) || item === '-' ? 'text-darkPurple3' : 'text-lilac';
          return (
            <td
              key={index}
              className={`max-w-80px border-l border-black ${itemStyle} p-5px text-right`}
            >
              {item}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <table className="my-5px text-xs">
      <thead className="border border-violet bg-violet font-bold text-white">
        <tr>{displayTh}</tr>
      </thead>
      <tbody>{displayTbody}</tbody>
    </table>
  );
};

export default ReportTable;
