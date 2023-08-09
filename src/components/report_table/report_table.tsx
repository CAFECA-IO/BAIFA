import {ITableRows, ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';

interface IReportTable {
  tableData: ITable;
  // theadSubLineData?: string[];
  // theadData?: string[];
  // tbodyData: ITableRows[];
}

interface IReportTableRow {
  row: ITableRows;
}

const ReportTableRow = ({row}: IReportTableRow) => {
  const {rowType, rowData} = row;
  let addCol = 0;

  const displayTitle = rowData.map((item, index) => {
    for (let i = 1; i < rowData.length; i++) {
      // Info: (20230807 - Julian) *-* 表示和後一個格子合併
      if (rowData[index + 1] === '*-*') addCol += 1;
      else break;
    }

    if (item === '*-*') return null;

    return (
      <td key={index} colSpan={1 + addCol} className="max-w-250px p-5px">
        {item}
      </td>
    );
  });

  const displayContent = rowData.slice(1).map((item, index) => (
    <td
      key={index}
      className="max-w-250px whitespace-nowrap border-l border-black p-5px text-right"
    >
      {item}
    </td>
  ));

  switch (rowType) {
    case RowType.headline:
      const displayTh = rowData.map((item, index) => {
        for (let i = 1; i < rowData.length; i++) {
          // Info: (20230807 - Julian) *-* 表示和後一個格子合併
          if (rowData[index + i] === '*-*') addCol += 1;
          else break;
        }

        // Info: (20230802 - Julian) 將 th 以 \n 斷行
        const thArr = item.split('\n');
        if (item === '*-*') return null;
        const displayThArr = thArr.map((item, index) => {
          return <p key={index}>{item}</p>;
        });

        return (
          <td key={index} colSpan={1 + addCol} className={`max-w-250px text-center`}>
            {displayThArr}
          </td>
        );
      });

      return (
        <tr className="border-x border-b border-violet bg-violet font-bold text-white">
          {displayTh}
        </tr>
      );

    case RowType.title:
      return (
        <tr className="border-x border-b border-black font-bold text-violet">{displayTitle}</tr>
      );

    case RowType.subtitle:
      return (
        <tr className="border-x border-b border-black font-bold text-black">{displayTitle}</tr>
      );

    case RowType.emptyRow:
      return <tr className="h-27px border-x border-b border-black text-white">{displayTitle}</tr>;

    case RowType.stringRow:
      return (
        <tr className="border-x border-b border-black">
          <td className="max-w-250px border-l border-black p-5px text-left font-bold text-violet">
            {rowData[0]}
          </td>
          {rowData.slice(1).map((item, index) => (
            <td
              key={index}
              className="w-70px max-w-250px border-l border-black p-5px text-center text-lilac"
            >
              {item}
            </td>
          ))}
        </tr>
      );

    case RowType.titleRow:
      return (
        <tr className="border-x border-b border-black font-bold">
          <td className="max-w-250px border-l border-black p-5px text-left text-violet">
            {rowData[0]}
          </td>
          {rowData.slice(1).map((item, index) => (
            <td key={index} className="w-70px max-w-250px border-l border-black p-5px text-center">
              {item}
            </td>
          ))}
        </tr>
      );

    case RowType.contentWithMainColumn:
      return (
        <tr className="border-x border-b border-black">
          <td className="max-w-250px border-l border-black p-5px text-lilac">{rowData[0]}</td>
          {displayContent}
        </tr>
      );

    case RowType.foot:
      return (
        <tr className="border-x border-b border-black bg-lilac2 font-bold">
          <td className="max-w-250px border-l border-black p-5px">{rowData[0]}</td>
          {displayContent}
        </tr>
      );

    default:
      return <tr></tr>;
  }
};

const ReportTableNew = ({tableData}: IReportTable) => {
  const {subThead, thead, tbody} = tableData;
  const thSize = !!!subThead ? 'py-10px text-xs' : 'py-5px text-xxs';

  const displayThead = !!thead ? (
    <thead className={`border border-violet bg-violet text-white`}>
      {/* Info: (20230808 - Julian) 副標題 */}
      <tr>
        {!!subThead &&
          subThead.map((item, index) => {
            let addThCol = 0;
            for (let i = 1; i < subThead.length; i++) {
              // Info: (20230807 - Julian) *-* 表示和後一個格子合併
              if (subThead[index + i] === '*-*') addThCol += 1;
              else break;
            }
            if (item === '*-*') return null;
            const rowspan = index === 0 ? 2 : 1;
            const thStyle = index === 0 ? 'text-center font-bold' : 'text-right font-normal';
            return (
              <th
                key={index}
                colSpan={1 + addThCol}
                rowSpan={rowspan}
                className={`max-w-250px whitespace-nowrap px-10px ${thStyle} ${thSize}`}
              >
                {item}
              </th>
            );
          })}
      </tr>
      {/* Info: (20230808 - Julian) 主標題 */}
      <tr>
        {thead.map((item, index) => {
          let addThCol = 0;
          for (let i = 1; i < thead.length; i++) {
            // Info: (20230807 - Julian) *-* 表示和後一個格子合併
            if (thead[index + i] === '*-*') addThCol += 1;
            else break;
          }
          if (item === '*-*' || item === '*|*') return null;
          return (
            <th
              key={index}
              colSpan={1 + addThCol}
              className={`max-w-250px whitespace-nowrap px-10px text-center font-bold ${thSize}`}
            >
              {item}
            </th>
          );
        })}
      </tr>
    </thead>
  ) : null;

  const displayTd = tbody.map((row, index) => <ReportTableRow key={index} row={row} />);

  return (
    <table className="w-full">
      {/* Info: (20230807 - Julian) Table head */}
      {displayThead}
      {/* Info: (20230807 - Julian) Table body */}
      <tbody className={`text-xs ${!!!displayThead ? 'border border-darkPurple3' : ''}`}>
        {displayTd}
      </tbody>
    </table>
  );
};

export default ReportTableNew;
