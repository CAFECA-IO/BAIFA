import {BFAURL} from '../constants/url';

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

export const ITEM_PER_PAGE = 10;

export const copyright = 'BAIFA @ 2023. All rights reserved.';

/* Info: (20230809 - Julian) ----- BAIFA Reposts ----- */
export const reportsDateSpan = {
  start: 1688190893,
  end: 1690646400,
};

/* Info: (20230711 - Julian) ----- Home Page ----- */
export const mainMenuContent = [
  {
    icon: '/icons/chain.svg',
    title: 'HOME_PAGE.CHAINS_TITLE',
    description: '30',
    mark: '+',
    link: BFAURL.COMING_SOON,
    alt: 'chain_icon',
  },
  {
    icon: '/icons/coin.svg',
    title: 'HOME_PAGE.CRYPTO_TITLE',
    description: '10000',
    mark: '+',
    link: BFAURL.COMING_SOON,
    alt: 'coin_icon',
  },
  {
    icon: '/icons/black_list.svg',
    title: 'HOME_PAGE.BLACKLIST_TITLE',
    description: '200',
    mark: '+',
    link: BFAURL.COMING_SOON,
    alt: 'blacklist_icon',
  },
];

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
    desktopImg: '/elements/tracing_tool_2.png',
    mobileImg: '/elements/tracing_tool.png',
    alt: 'tracing_tool',
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
    image: '/elements/tracing.png',
    alt: 'a screenshot of tracing tool',
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

/* Info: (20230831 - Julian) ----- All Chains Page ----- */
export const dummyChains = [
  {
    chainId: 'bolt',
    chainName: 'BOLT',
    icon: '/currencies/bolt.svg',
    blocks: 12093,
    transactions: 33233,
  },
  {
    chainId: 'eth',
    chainName: 'Ethereum',
    icon: '/currencies/ethereum.svg',
    blocks: 102000,
    transactions: 891402,
  },
  {
    chainId: 'btc',
    chainName: 'Bitcoin',
    icon: '/currencies/bitcoin.svg',
    blocks: 10053,
    transactions: 31294,
  },
];

/* Info: (20230814 - Julian) ----- Landing Footer ----- */
export const baifaAddress = process.env.BAIFA_ADDRESS_IN_ENGLISH;
export const baifaAddressOnMap = process.env.BAIFA_ADDRESS_ON_GOOGLE_MAP;
export const baifaPhone = process.env.BAIFA_PHONE_NUMBER;
export const githubLink = process.env.GITHUB_LINK;
