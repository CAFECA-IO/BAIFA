import {REPORT_PATH} from '../constants/url';

export const TBD_API_URL = 'https://api.tidebit-defi.com/api';
export const TBD_API_VERSION = 'v1';

export const BFA_API_URL = '/api';
export const BFA_API_VERSION = 'v1';

// Info: (20240206 - Julian) default icons
export const DEFAULT_CHAIN_ICON = '/chains/default_chain.svg';
export const DEFAULT_CURRENCY_ICON = '/currencies/default_currency.svg';

export const DEFAULT_TRUNCATE_LENGTH = 10;

export const MONTH_LIST = [
  'DATE_PICKER.JAN',
  'DATE_PICKER.FEB',
  'DATE_PICKER.MAR',
  'DATE_PICKER.APR',
  'DATE_PICKER.MAY',
  'DATE_PICKER.JUN',
  'DATE_PICKER.JUL',
  'DATE_PICKER.AUG',
  'DATE_PICKER.SEP',
  'DATE_PICKER.OCT',
  'DATE_PICKER.NOV',
  'DATE_PICKER.DEC',
];

export const WEEK_LIST = [
  'DATE_PICKER.SUN',
  'DATE_PICKER.MON',
  'DATE_PICKER.TUE',
  'DATE_PICKER.WED',
  'DATE_PICKER.THU',
  'DATE_PICKER.FRI',
  'DATE_PICKER.SAT',
];

export const sortOldAndNewOptions = ['SORTING.NEWEST', 'SORTING.OLDEST'];
export const default30DayPeriod = {
  startTimeStamp: 0,
  endTimeStamp: 0,
};

export const ITEM_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const TOP_100_HOLDER_MAX_TOTAL_PAGES = 100 / ITEM_PER_PAGE;

export const copyright = 'BAIFA @ 2024. All rights reserved.';

/* Info: (20230711 - Julian) ----- Landing Page ----- */
export const SCROLL_END = 530;

export const massiveDataContent = [
  {
    icon: '/icons/wallet.svg',
    text: 'LANDING_PAGE.MASSIVE_DATA_WALLET',
    alt: 'wallet_icon',
  },
  {
    icon: '/icons/blacklist.svg',
    text: 'LANDING_PAGE.MASSIVE_DATA_BLACKLIST',
    alt: 'blacklist_icon',
  },
  {
    icon: '/icons/block.svg',
    text: 'LANDING_PAGE.MASSIVE_DATA_BLOCK',
    alt: 'block_icon',
  },
  {
    icon: '/icons/transaction.svg',
    text: 'LANDING_PAGE.MASSIVE_DATA_TRANSACTION',
    alt: 'transaction_icon',
  },
  {
    icon: '/icons/evidence.svg',
    text: 'LANDING_PAGE.MASSIVE_DATA_EVIDENCE',
    alt: 'evidence_icon',
  },
];

export const toolsContent = [
  {
    title: 'LANDING_PAGE.TOOL_INTRO_1_TITLE',
    description: 'LANDING_PAGE.TOOL_INTRO_1_DESCRIPTION',
    desktopImg: '/elements/tracking_tool_2.png',
    mobileImg: '/elements/tracking_tool.png',
    alt: 'tracking_tool',
  },
  {
    title: 'LANDING_PAGE.TOOL_INTRO_2_TITLE',
    description: 'LANDING_PAGE.TOOL_INTRO_2_DESCRIPTION',
    desktopImg: '/elements/auditing_tool_1.png',
    mobileImg: '/elements/auditing_tool.png',
    alt: 'auditing_tool',
  },
  {
    title: 'LANDING_PAGE.TOOL_INTRO_3_TITLE',
    description: 'LANDING_PAGE.TOOL_INTRO_3_DESCRIPTION',
    desktopImg: '/elements/document.png',
    mobileImg: '/elements/document.png',
    alt: 'generate_reports',
  },
];

export const servicesContent = [
  {
    image: '/elements/tracking.png',
    alt: 'a screenshot of tracking tool',
    description: 'LANDING_PAGE.SERVICES_DESCRIPTION_1',
  },
  {
    image: '/elements/report.png',
    alt: 'balance sheet',
    description: 'LANDING_PAGE.SERVICES_DESCRIPTION_2',
  },
  {
    image: '/elements/law.png',
    alt: 'a weighing scale',
    description: 'LANDING_PAGE.SERVICES_DESCRIPTION_3',
  },
  {
    image: '/elements/safety_money.png',
    alt: 'a shield check image',
    description: 'LANDING_PAGE.SERVICES_DESCRIPTION_4',
  },
  {
    image: '/elements/smart_contract_1.png',
    alt: 'contracts image',
    description: 'LANDING_PAGE.SERVICES_DESCRIPTION_5',
  },
];

export const whyUsContent = [
  {
    image: '/icons/safety_1.svg',
    alt: 'safety icon',
    description: 'LANDING_PAGE.WHY_BAIFA_DESCRIPTION_1',
  },
  {
    image: '/icons/financial_report.svg',
    alt: 'financial report icon',
    description: 'LANDING_PAGE.WHY_BAIFA_DESCRIPTION_2',
  },
  {
    image: '/icons/compliance.svg',
    alt: 'compliance icon',
    description: 'LANDING_PAGE.WHY_BAIFA_DESCRIPTION_3',
  },
  {
    image: '/icons/accountant.svg',
    alt: 'accountant icon',
    description: 'LANDING_PAGE.WHY_BAIFA_DESCRIPTION_4',
  },
];

/* Info: (20230814 - Julian) ----- Landing Footer ----- */
export const baifaAddress = process.env.BAIFA_ADDRESS_IN_ENGLISH;
export const baifaAddressOnMap = process.env.BAIFA_ADDRESS_ON_GOOGLE_MAP;
export const baifaPhone = process.env.BAIFA_PHONE_NUMBER;
export const githubLink = process.env.GITHUB_LINK;

/* Info: (20230814 - Julian) ----- Reports ----- */
export const CLOSING_TIME = 57600;

export const A4_SIZE = {
  WIDTH: 595,
  HEIGHT: 842,
};

export const pluginReportsList = [
  {
    name: 'PLUGIN.COMPREHENSIVE_INCOME_STATEMENT',
    imageSrc: '/icons/income_statement_icon.svg',
    linkPath: `${REPORT_PATH.INCOME_STATEMENTS}`,
  },
  {
    name: 'PLUGIN.BALANCE_SHEET',
    imageSrc: '/icons/balance_sheet_icon.svg',
    linkPath: `${REPORT_PATH.BALANCE_SHEETS}`,
  },
  {
    name: 'PLUGIN.CASH_FLOW_STATEMENT',
    imageSrc: '/icons/cash_flow_statement_icon.svg',
    linkPath: `${REPORT_PATH.CASH_FLOW_STATEMENTS}`,
  },
  {
    name: 'PLUGIN.RED_FLAG_ANALYSIS',
    imageSrc: '/icons/red_flags_icon.svg',
    linkPath: `${REPORT_PATH.RED_FLAGS}`,
  },
];

/* Info: (20240320 - Julian) ----- Red flag ----- */
export const defaultOption = 'SORTING.ALL';

export const redFlagTypeI18nObj: {[key: string]: string} = {
  'Multiple Transfer': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_TRANSFER',
  'Multiple Receives': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
  'Large Deposit': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT',
  'With Mixing Service': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MIXING_SERVICE',
  'Multiple Withdraw': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
  'With Gambling Site': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_GAMBLING_SITE',
  'Large Withdraw': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
  'With Black List': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_BLACK_LIST',
  'With Darknet': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_DARKNET',
  'Large Transfer': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_TRANSFER',
};

/* Info: (20230814 - Julian) ----- Chains ----- */
export const chainList = ['eth', 'bit', 'usdt', 'bnb', 'isun'];

export const chainIdToCurrencyName = [
  {id: 'eth', name: 'Ethereum'},
  {id: 'btc', name: 'Bitcoin'},
  {id: 'usdt', name: 'Tether'},
  {id: 'bnb', name: 'Binance Coin'},
  {id: 'isun', name: 'iSunCloud'},
];

export const INPUT_SUGGESTION_LIMIT = 10;

export const THRESHOLD_FOR_BLOCK_STABILITY = {
  HIGH: 20,
  MEDIUM: 10,
  LOW: 10,
};

export const buttonStyle =
  'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite hover:cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:border-transparent';

export const MAX_64_BIT_INTEGER_PARAMETER = '9223372036854775807';
export const MIN_64_BIT_INTEGER_PARAMETER = '-9223372036854775808';

export const MILLISECONDS_IN_A_SECOND = 1000;
export const FAILED_TRANSACTION_STATUS_CODE = 2;
export const DEFAULT_RED_FLAG_COUNT = 0;
export const DEFAULT_INTERACTED_ACCOUNT_COUNT = 0;

export const DEFAULT_REVIEWS_COUNT_IN_PAGE = 3;
export const DEFAULT_RED_FLAG_COUNT_IN_PAGE = 3;

export const CODE_WHEN_NULL = 9999999999;

export const sortMostAndLeastOptions = ['SORTING.MOST', 'SORTING.LEAST'];

export const THRESHOLD_FOR_ADDRESS_RISK_LEVEL = {
  HIGH: 100,
  MEDIUM: 10,
  LOW: 10,
};

// Info: Documents/BFA/db_schema 寫定的 public_tags table 的 tag_type 欄位，因為不需要從 codes table 動態對照，所以先寫 static object 以利後續維護 (20240301 - Shirley)
export const PUBLIC_TAGS_REFERENCE = {
  TAG_TYPE: {
    BLACKLIST: '9',
  },
};
