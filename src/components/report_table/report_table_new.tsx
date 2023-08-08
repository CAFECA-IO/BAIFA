export type IRowType =
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'emptyRow'
  | 'contentWithMainColumn'
  | 'content'
  | 'foot';

type IRowTypeContent = {
  headline: IRowType;
  title: IRowType;
  subtitle: IRowType;
  emptyRow: IRowType;
  contentWithMainColumn: IRowType;
  content: IRowType;
  foot: IRowType;
};

export const RowType: IRowTypeContent = {
  headline: 'headline',
  title: 'title',
  subtitle: 'subtitle',
  emptyRow: 'emptyRow',
  contentWithMainColumn: 'contentWithMainColumn',
  content: 'content',
  foot: 'foot',
};

interface IReportTableProps {
  theadSubLineData?: string[];
  theadData?: string[];
  tbodyData: {
    rowType: IRowType;
    rowData: string[];
  }[];
}

interface IReportTableRowProps {
  rowType: IRowType;
  rowData: string[];
}

const ReportTableRow = ({rowType, rowData}: IReportTableRowProps) => {
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

    case RowType.contentWithMainColumn:
      const displayContentWithMainColumn = rowData.slice(1).map((item, index) => {
        return (
          <td key={index} className="max-w-250px border-l border-black p-5px text-right">
            {item}
          </td>
        );
      });
      return (
        <tr className="border-x border-b border-black">
          <td className="max-w-250px border-l border-black p-5px text-lilac">{rowData[0]}</td>
          {displayContentWithMainColumn}
        </tr>
      );

    case RowType.foot:
      const displayFoot = rowData.slice(1).map((item, index) => {
        return (
          <td key={index} className="max-w-250px border-l border-black p-5px text-right">
            {item}
          </td>
        );
      });
      return (
        <tr className="border-x border-b border-black bg-lilac2 font-bold">
          <td className="max-w-250px border-l border-black p-5px">{rowData[0]}</td>
          {displayFoot}
        </tr>
      );
    default:
      return <tr></tr>;
  }
};

const ReportTableNew = ({theadSubLineData, theadData, tbodyData}: IReportTableProps) => {
  const thSize = !!!theadSubLineData ? 'py-10px text-xs' : 'py-5px text-xxs';

  const displayTh = (rowData: string[], thStyle: string) => {
    if (!rowData || rowData.length === 0) return null;
    return (
      <tr>
        {rowData.map((item, index) => {
          let addThCol = 0;
          for (let i = 1; i < rowData.length; i++) {
            // Info: (20230807 - Julian) *-* 表示和後一個格子合併
            if (rowData[index + i] === '*-*') addThCol += 1;
            else break;
          }
          if (item === '*-*') return null;
          return (
            <th
              key={index}
              colSpan={1 + addThCol}
              className={`max-w-250px whitespace-nowrap px-10px ${thStyle} ${thSize}`}
            >
              {item}
            </th>
          );
        })}
      </tr>
    );
  };

  const displayThead = !!theadData ? (
    <thead className={`border border-violet bg-violet text-white`}>
      {/* Info: (20230808 - Julian) 副標題 */}
      <tr>
        {!!theadSubLineData &&
          theadSubLineData.map((item, index) => {
            let addThCol = 0;
            for (let i = 1; i < theadSubLineData.length; i++) {
              // Info: (20230807 - Julian) *-* 表示和後一個格子合併
              if (theadSubLineData[index + i] === '*-*') addThCol += 1;
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
        {!!theadData &&
          theadData.map((item, index) => {
            let addThCol = 0;
            for (let i = 1; i < theadData.length; i++) {
              // Info: (20230807 - Julian) *-* 表示和後一個格子合併
              if (theadData[index + i] === '*-*') addThCol += 1;
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

  const displayTd = tbodyData.map(({rowType, rowData}, index) => (
    <ReportTableRow key={index} rowType={rowType} rowData={rowData} />
  ));

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
