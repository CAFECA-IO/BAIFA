export type IRowType =
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'emptyRow'
  | 'bookkeeping'
  | 'content'
  | 'stringRow'
  | 'titleRow'
  | 'foot';

export type IRowTypeContent = {
  headline: IRowType;
  title: IRowType;
  subtitle: IRowType;
  emptyRow: IRowType;
  bookkeeping: IRowType;
  content: IRowType;
  stringRow: IRowType;
  titleRow: IRowType;
  foot: IRowType;
};

export const RowType: IRowTypeContent = {
  headline: 'headline',
  title: 'title',
  subtitle: 'subtitle',
  emptyRow: 'emptyRow',
  bookkeeping: 'bookkeeping',
  content: 'content',
  stringRow: 'stringRow',
  titleRow: 'titleRow',
  foot: 'foot',
};
