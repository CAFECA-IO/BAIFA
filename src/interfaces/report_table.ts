export interface ITableRows {
  rowType: string;
  rowData: string[];
}

export interface ITable {
  subThead?: string[];
  thead?: string[];
  tbody: ITableRows[];
}
