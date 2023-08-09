export type IRowType =
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'emptyRow'
  | 'contentWithMainColumn'
  | 'stringRow'
  | 'titleRow'
  | 'foot';

export type IRowTypeContent = {
  headline: IRowType;
  title: IRowType;
  subtitle: IRowType;
  emptyRow: IRowType;
  contentWithMainColumn: IRowType;
  stringRow: IRowType;
  titleRow: IRowType;
  foot: IRowType;
};

export const RowType: IRowTypeContent = {
  headline: 'headline',
  title: 'title',
  subtitle: 'subtitle',
  emptyRow: 'emptyRow',
  contentWithMainColumn: 'contentWithMainColumn',
  stringRow: 'stringRow',
  titleRow: 'titleRow',
  foot: 'foot',
};
