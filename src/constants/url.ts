export const BFAURL = {
  HOME: '/',
  COMING_SOON: '/coming-soon',
  CONTACT_US: '/contact-us',
  APP: '/app',
  CHAINS: '/app/chains',
  CURRENCIES: '/app/currencies',
  TRACING_TOOL: '/app/tracing-tool',
  AUDITING_TOOL: '/app/auditing-tool',
  RED_FLAG: '/app/red-flag',
  FAQ: '/app/faq',

  BLOCK: '/app/block',
  TRANSACTION: '/app/transaction',
  TRANSACTION_LIST: '/app/transaction-list',
  ADDRESS: '/app/address',
};

export const getDynamicUrl = (chain: string, id: string) => {
  return {
    BLOCK: `/app/chains/${chain}/block/${id}`,
    TRANSACTION: `/app/chains/${chain}/transaction/${id}`,
    TRANSACTION_LIST: `/app/chains/${chain}/transaction-list/${id}`,
  };
};

export const REPORT_PATH = {
  REPORTS: '/reports',
  BALANCE_SHEETS: 'balance',
  INCOME_STATEMENTS: 'comprehensive-income',
  CASH_FLOW_STATEMENTS: 'cash-flow',
  RED_FLAGS: 'red-flags',
};
