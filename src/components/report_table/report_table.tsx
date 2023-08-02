// ToDo: (20230802 - Julian) 整理 interface
const testTable = {
  thead: ['$ in Thousands', 'Jul. 30, 2023', 'Jul. 1, 2023'],
  tbody: [
    {
      title: 'Customer custodial funds',
      items: [1000, 1000],
    },
    {
      title: 'Total customer assets',
      items: [1000, 1000],
    },
    {
      title: 'Customer custodial cash liabilities',
      items: [1000, 1000],
    },
    {
      title: 'Total customer liaiblities',
      items: [1000, 1000],
    },
  ],
};

const ReportTable = () => {
  const displayTh = testTable.thead.map((item, index) => {
    return (
      <th key={index} className="py-10px">
        {item}
      </th>
    );
  });

  const displayTbody = testTable.tbody.map((row, index) => {
    const rowStyle = row.title.includes('Total')
      ? 'bg-lilac2 font-bold text-darkPurple3'
      : 'text-darkPurple3';
    const titleColor = row.title.includes('Total') ? 'text-darkPurple3' : 'text-lilac';

    return (
      <tr key={index} className={`border-x border-b border-black ${rowStyle}`}>
        <td className={`p-5px ${titleColor}`}>{row.title}</td>
        {row.items.map((item, index) => {
          return (
            <td key={index} className="border-l border-black p-5px text-right">
              $ {item}
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
