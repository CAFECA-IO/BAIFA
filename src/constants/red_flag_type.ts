export type IRedFlagType =
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_TRANSFER'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_TRANSFER'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MIXING_SERVICE'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_BLACK_LIST'
  | 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_DARKNET';

export type IRedFlagTypeContent = {
  MULTIPLE_RECEIVES: IRedFlagType;
  MULTIPLE_TRANSFER: IRedFlagType;
  LARGE_TRANSFER: IRedFlagType;
  LARGE_DEPOSIT: IRedFlagType;
  MULTIPLE_WITHDRAW: IRedFlagType;
  LARGE_WITHDRAW: IRedFlagType;
  MIXING_SERVICE: IRedFlagType;
  GAMBLING_SITE: IRedFlagType;
  BLACK_LIST: IRedFlagType;
  DARKNET: IRedFlagType;
};

export const RedFlagType: IRedFlagTypeContent = {
  MULTIPLE_RECEIVES: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
  MULTIPLE_TRANSFER: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_TRANSFER',
  LARGE_TRANSFER: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_TRANSFER',
  LARGE_DEPOSIT: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT',
  MULTIPLE_WITHDRAW: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
  LARGE_WITHDRAW: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
  MIXING_SERVICE: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MIXING_SERVICE',
  GAMBLING_SITE: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE',
  BLACK_LIST: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_BLACK_LIST',
  DARKNET: 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_DARKNET',
};
