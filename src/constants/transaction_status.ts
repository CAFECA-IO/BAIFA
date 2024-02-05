interface ITransactionStatus {
  [key: string]: {
    text: string;
    color: string;
    icon: string;
  };
}

export const TransactionStatus: ITransactionStatus = {
  'Pending': {
    text: 'CHAIN_DETAIL_PAGE.STATUS_PENDING',
    color: 'text-hoverWhite',
    icon: '/animations/trade_processing.gif',
  },
  'Success': {
    text: 'CHAIN_DETAIL_PAGE.STATUS_SUCCESS',
    color: 'text-lightGreen',
    icon: '/icons/success_icon.svg',
  },
  'Fail': {
    text: 'CHAIN_DETAIL_PAGE.STATUS_FAILED',
    color: 'text-lightRed',
    icon: '/icons/failed_icon.svg',
  },
};

export const DefaultTransactionStatus = {
  text: 'CHAIN_DETAIL_PAGE.STATUS_FAILED',
  color: 'text-lightRed',
  icon: '/icons/failed_icon.svg',
};
