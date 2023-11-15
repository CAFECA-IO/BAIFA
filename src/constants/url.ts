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
  BLACKLIST: '/app/blacklist',
  TRANSACTION_LIST: '/app/transaction-list',
  SEARCHING_RESULT: '/app/searching-result',
};

export const getDynamicUrl = (chain: string, id: string) => {
  return {
    BLOCK: `/app/chains/${chain}/block/${id}`,
    TRANSACTION: `/app/chains/${chain}/transaction/${id}`,
    ADDRESS: `/app/chains/${chain}/address/${id}`,
    CONTRACT: `/app/chains/${chain}/contract/${id}`,
    EVIDENCE: `/app/chains/${chain}/evidence/${id}`,
    REVIEWS: `/app/chains/${chain}/address/${id}/reviews`,
    INTERACTION: `/app/chains/${chain}/address/${id}/interaction`,
    RED_FLAG: `/app/chains/${chain}/address/${id}/red-flag`,
  };
};

export const REPORT_PATH = {
  REPORTS: '/reports',
  BALANCE_SHEETS: 'balance',
  INCOME_STATEMENTS: 'comprehensive-income',
  CASH_FLOW_STATEMENTS: 'cash-flow',
  RED_FLAGS: 'red-flags',
};
