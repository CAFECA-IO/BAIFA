import {IReportTable} from '../interfaces/report_table';

export const balance_sheets_p3_1: IReportTable = {
  thead: ['Balance Sheets - USD ($)', 'Jul. 30, 2023', 'Jul. 1, 2023'],
  tbody: [
    {
      title: 'Assets',
      items: ['*-*', '*-*'],
    },
    {
      title: 'Current assets:',
      items: ['*-*', '*-*'],
    },
    {
      title: 'Customer custodial funds',
      items: ['$ 24278.30', '$ 24467.11'],
    },
    {
      title: 'USDT',
      items: ['349.09', '67.21'],
    },
    {
      title: 'Account receivable',
      items: ['0', '0'],
    },
    {
      title: 'Assets pledged as collateral',
      items: ['0', '0'],
    },
    {
      title: ' Total current assets',
      items: ['24,627.39', '24,534.32'],
    },
    {
      title: 'Non-current assets:',
      items: ['*-*', '*-*'],
    },
    {
      title: 'Crypto assets held',
      items: ['0', '0'],
    },
    {
      title: 'Total assets',
      items: ['$ 24,627.39', '$ 24,534.32'],
    },
    {
      title: `Liabilities and Stockholders' Equity`,
      items: ['*-*', '*-*'],
    },
    {
      title: 'Current liabilities:',
      items: ['*-*', '*-*'],
    },
    {
      title: 'Customer custodial cash liabilities',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Accounts payable',
      items: ['0', '0'],
    },
    {
      title: 'Total liabilities',
      items: ['$ 24,278.30', '$ 24,467.11'],
    },
    {
      title: `Stockholders' equity`,
      items: ['*-*', '*-*'],
    },
    {
      title: 'Additional paid-in capital',
      items: ['0', '0'],
    },
    {
      title: 'Accumulated other comprehensive income',
      items: ['0', '0'],
    },
    {
      title: 'Retained earnings',
      items: ['349.09', '67.21'],
    },
    {
      title: ` Total stockholders' equity`,
      items: ['349.09', '67.21'],
    },
    {
      title: `Total liabilities and stockholders' equity`,
      items: ['$ 24,627.39', '$ 24,534.32'],
    },
  ],
};

export const balance_sheets_p6_1: IReportTable = {
  thead: ['', 'Jul. 30, 2023', 'Jul. 1, 2023'],
  tbody: [
    {
      title: 'Customer custodial funds',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Total customer assets',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Customer custodial cash liabilities',
      items: ['$ 24278.3', '$ 24467.11'],
    },
    {
      title: 'Total customer liaiblities',
      items: ['$ 24278.3', '$ 24467.11'],
    },
  ],
};

export const balance_sheets_p6_2: IReportTable = {
  thead: ['', '*-*', 'Jul. 30, 2023', '*-*', 'Jul. 1, 2023'],
  tbody: [
    {
      title: '',
      items: ['Fair Value', 'Percentage of Total', 'Fair Value', 'Percentage of Total'],
    },
    {
      title: 'Bitcoin',
      items: ['—', '—', '—', '—'],
    },
    {
      title: 'Ethereum',
      items: ['—', '—', '—', '—'],
    },
    {
      title: 'USDT',
      items: ['$ 24278.3', '100.0%', '$ 24467.11', '100.0%'],
    },
    {
      title: 'Total customer crypto assets',
      items: ['$ 24278.3', '100.0%', '$ 24467.11', '100.0%'],
    },
  ],
};

export const balance_sheets_p7_1: IReportTable = {
  thead: ['$ in Thousands', '*-*', 'Jul. 30, 2023', '*-*', 'Jul. 1, 2023'],
  tbody: [
    {
      title: '',
      items: ['Units', 'Fair Value', 'Units', 'Fair Value'],
    },
    {
      title: 'Assets Pledged as Collateral',
      items: ['*-*', '*-*', '*-*', '*-*'],
    },
    {
      title: 'USDT',
      items: ['—', '—', '—', '—'],
    },
    {
      title: 'Bitcoin',
      items: ['—', '—', '—', '—'],
    },
    {
      title: 'Ethereum',
      items: ['—', '—', '—', '—'],
    },
    {
      title: 'Total',
      items: ['—', '—', '—', '—'],
    },
  ],
};
