interface IReportTableTbody {
  title: string;
  items: string[];
}

export interface IReportTable {
  thead: string[];
  tbody: IReportTableTbody[];
}
