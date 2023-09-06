import {ITableRows, ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';
import {withCommas} from '../../lib/common';

interface IReportTable {
  tableData: ITable;
}

interface IReportTableRow {
  row: ITableRows;
}

const ReportTableRow = ({row}: IReportTableRow) => {
  const {rowType, rowData} = row;

  const displayTitle = rowData.map((item, index) => {
    let addCol = 0;
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
      {withCommas(item)}
    </td>
  ));

  switch (rowType) {
    // Info: (20230809 - Julian) 和表頭一樣，紫底白字
    case RowType.headline:
      let addCol = 0;
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
    // Info: (20230809 - Julian) 單格，粗體紫字
    case RowType.title:
      return (
        <tr className="border-x border-b border-black font-bold text-violet">{displayTitle}</tr>
      );
    // Info: (20230809 - Julian) 單格，粗體黑字
    case RowType.subtitle:
      return (
        <tr className="border-x border-b border-black font-bold text-black">{displayTitle}</tr>
      );
    // Info: (20230809 - Julian) 單格，空白行
    case RowType.emptyRow:
      return <tr className="h-27px border-x border-b border-black text-white">{displayTitle}</tr>;
    // Info: (20230809 - Julian) 第一格粗體紫字，其餘置中灰字
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
    // Info: (20230809 - Julian) 第一格粗體紫字，其餘置中粗體黑字
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
    // Info: (20230809 - Julian) 全部置中灰字
    case RowType.content:
      return (
        <tr className="border-x border-black text-center text-lilac">
          {rowData.map((item, index) => (
            <td key={index} className="w-80px border-l border-black p-5px">
              {item}
            </td>
          ))}
        </tr>
      );
    // Info: (20230809 - Julian) 第一格灰字，其餘置右黑字
    case RowType.bookkeeping:
      return (
        <tr className="border-x border-b border-black">
          <td className="max-w-250px border-l border-black p-5px text-lilac">{rowData[0]}</td>
          {displayContent}
        </tr>
      );
    // Info: (20230809 - Julian) 淺紫底色 + 粗體黑字
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

const ReportTable = ({tableData}: IReportTable) => {
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
            // Info: (20230809 - Julian) 若副標題存在，且第二行有 *|* ，則副標題的第一格要跨兩行
            // workaround 按照現有的設計，表頭最多只會有兩行，所以這邊直接寫死。如果未來有更多行的表頭則再調整
            const rowSpan = thead.includes('*|*') && index === 0 ? 2 : 1;
            const thStyle = index === 0 ? 'text-center font-bold' : 'text-right font-normal';
            return (
              <th
                key={index}
                colSpan={1 + addThCol}
                rowSpan={rowSpan}
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
              className={`max-w-250px whitespace-normal px-10px text-center font-bold ${thSize}`}
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
      <tbody className={`border-b border-darkPurple3 text-xs ${!!!displayThead ? 'border-t' : ''}`}>
        {displayTd}
      </tbody>
    </table>
  );
};

export default ReportTable;
