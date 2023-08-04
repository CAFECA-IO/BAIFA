import {IReportTable} from '../../interfaces/report_table';

interface IReportTableProps {
  tableData: IReportTable;
}

const ReportTable = ({tableData}: IReportTableProps) => {
  const displayTh = tableData.thead.map((item, index) => {
    // Info: (20230802 - Julian) *-* 表示和前一個格子合併
    const colSpan = tableData.thead[index - 1] === '*-*' ? 1 : 0;
    // Info: (20230802 - Julian) 將 th 以 \n 斷行
    const thArr = item.split('\n');

    if (item === '*-*') return null;

    const displayThArr = thArr.map((item, index) => {
      return <p key={index}>{item}</p>;
    });

    return (
      <th key={index} colSpan={1 + colSpan} className="py-10px text-center">
        {displayThArr}
      </th>
    );
  });

  const displayTbody = tableData.tbody.map((row, index) => {
    const rowBg = row.title.match(/^Total/) ? 'bg-lilac2' : '';

    const displayRow = row.items.map((item, index) => {
      const isBold = row.title.match(/^Total/) ? 'font-bold' : '';
      const textStyles =
        !!item.match(/[0-9]/) || item === '—'
          ? 'text-darkPurple3 text-right'
          : 'text-lilac text-center';

      if (item === '*-*') return;
      return (
        <td
          key={index}
          className={`max-w-80px border-l border-black p-5px ${isBold} ${rowBg} ${textStyles}`}
        >
          {item}
        </td>
      );
    });

    const titleStyle =
      row.title.match(/^Total/) || row.title.match(/:$/)
        ? 'text-darkPurple3 font-bold'
        : !displayRow[0]
        ? 'text-violet font-bold'
        : 'text-lilac';

    // Info: (20230802 - Julian) 若 displayRow[0] 為 undefined，則設定 titleColSpan 為 row.items.length + 1(陣列由 0 開始數) + 1(Title 欄位)
    const titleColSpan = !displayRow[0] ? row.items.length + 2 : 1;

    return (
      <tr key={index} className={`border-x border-b border-black text-darkPurple3`}>
        <td className={`p-5px ${titleStyle} ${rowBg}`} colSpan={titleColSpan}>
          {row.title}
        </td>

        {displayRow}
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
