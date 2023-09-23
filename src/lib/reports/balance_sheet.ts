import {IBalanceSheet, IBalanceAccountingDetail} from '../../interfaces/balance_sheet';
import {roundToDecimal} from '../../lib/common';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';

export const createBalanceSheetsTable = (
  dates: string[],
  dataA: IBalanceSheet | undefined,
  dataB: IBalanceSheet | undefined
) => {
  const subThead = ['Balance Sheets - USD ($)', '', ''];
  const thead = ['$ in Thousands', dates[0], dates[1]];
  const defaultTable: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Assets', '*-*', '*-*'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash and cash equivalents', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrencies', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Account receivable', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Total current assets', `—`, `—`],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Non-current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Total non-current assets', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total assets', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: [`Liabilities and Stockholders' Equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Current liabilities:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['User deposits', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Accounts payable', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total liabilities', `—`, `—`],
      },
      {
        rowType: RowType.title,
        rowData: [`Stockholders' equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Capital', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Retained earnings', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Total stockholders' equity`, `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: [`Total liabilities and stockholders' equity`, `$ —`, `$ —`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const totalAssetsA = +dataA.assets.weightedAverageCost + +dataA.nonAssets.weightedAverageCost;
  const totalAssetsB = +dataB.assets.weightedAverageCost + +dataB.nonAssets.weightedAverageCost;

  const totalLiabilitiesAndStockholdersA =
    +dataA.liabilities.weightedAverageCost + +dataA.equity.weightedAverageCost;
  const totalLiabilitiesAndStockholdersB =
    +dataB.liabilities.weightedAverageCost + +dataB.equity.weightedAverageCost;

  const result: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Assets', '*-*', '*-*'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash and cash equivalents',
          `$ ${roundToDecimal(+dataA.assets.details.cashAndCashEquivalent.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.assets.details.cashAndCashEquivalent.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies',
          `${roundToDecimal(+dataA.assets.details.cryptocurrency.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.assets.details.cryptocurrency.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Account receivable',
          `${roundToDecimal(+dataA.assets.details.accountsReceivable.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.assets.details.accountsReceivable.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total current assets',
          `${roundToDecimal(+dataA.assets.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.assets.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Non-current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total non-current assets',
          `${roundToDecimal(+dataA.nonAssets.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.nonAssets.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total assets',
          `$ ${roundToDecimal(totalAssetsA, 2)}`,
          `$ ${roundToDecimal(totalAssetsB, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: [`Liabilities and Stockholders' Equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Current liabilities:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'User deposits',
          `${roundToDecimal(+dataA.liabilities.details.userDeposit.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.liabilities.details.userDeposit.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Accounts payable',
          `${roundToDecimal(+dataA.liabilities.details.accountsPayable.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.liabilities.details.accountsPayable.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liabilities',
          `${roundToDecimal(+dataA.liabilities.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.liabilities.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: [`Stockholders' equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Capital',
          `${roundToDecimal(+dataA.equity.details.capital.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.equity.details.capital.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Retained earnings',
          `${roundToDecimal(+dataA.equity.details.retainedEarnings.totalAmountFairValue, 2)}`,
          `${roundToDecimal(+dataB.equity.details.retainedEarnings.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Total stockholders' equity`,
          `${roundToDecimal(+dataA.equity.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.equity.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          `Total liabilities and stockholders' equity`,
          `$ ${roundToDecimal(totalLiabilitiesAndStockholdersA, 2)}`,
          `$ ${roundToDecimal(totalLiabilitiesAndStockholdersB, 2)}`,
        ],
      },
    ],
  };
  return result;
};

export const createUserDepositTable = (
  dates: string[],
  dataA: IBalanceAccountingDetail | undefined,
  dataB: IBalanceAccountingDetail | undefined
) => {
  const thead = ['', dates[0], '*-*', '*-*', dates[1], '*-*', '*-*'];
  const defaultTable: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '',
          'Amount',
          'Fair Value',
          'Percentage of Total',
          'Amount',
          'Fair Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', `—`, `—`, `— %`, `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', `—`, `—`, `— %`, `—`, `—`, `— %`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total user deposits', `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const totalFairValueA = +dataA.totalAmountFairValue;
  const totalFairValueB = +dataB.totalAmountFairValue;

  const btcPerA = (+dataA.breakdown.BTC.fairValue / totalFairValueA) * 100;
  const btcPerB = (+dataB.breakdown.BTC.fairValue / totalFairValueB) * 100;

  const ethPerA = (+dataA.breakdown.ETH.fairValue / totalFairValueA) * 100;
  const ethPerB = (+dataB.breakdown.ETH.fairValue / totalFairValueB) * 100;

  const usdtPerA = (+dataA.breakdown.USDT.fairValue / totalFairValueA) * 100;
  const usdtPerB = (+dataB.breakdown.USDT.fairValue / totalFairValueB) * 100;

  const totalPerA = btcPerA + ethPerA + usdtPerA;
  const totalPerB = btcPerB + ethPerB + usdtPerB;

  const result: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '',
          'Amount',
          'Fair Value',
          'Percentage of Total',
          'Amount',
          'Fair Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${roundToDecimal(+dataA.breakdown.BTC.amount, 2)}`,
          `$ ${roundToDecimal(+dataA.breakdown.BTC.fairValue, 2)}`,
          `${roundToDecimal(btcPerA, 1)} %`,
          `${roundToDecimal(+dataB.breakdown.BTC.amount, 2)}`,
          `$ ${roundToDecimal(+dataB.breakdown.BTC.fairValue, 2)}`,
          `${roundToDecimal(btcPerB, 1)}%`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${roundToDecimal(+dataA.breakdown.ETH.amount, 2)}`,
          `${roundToDecimal(+dataA.breakdown.ETH.fairValue, 2)}`,
          `${roundToDecimal(ethPerA, 1)} %`,
          `${roundToDecimal(+dataB.breakdown.ETH.amount, 2)}`,
          `${roundToDecimal(+dataB.breakdown.ETH.fairValue, 2)}`,
          `${roundToDecimal(ethPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${roundToDecimal(+dataA.breakdown.USDT.amount, 2)}`,
          `${roundToDecimal(+dataA.breakdown.USDT.fairValue, 2)}`,
          `${roundToDecimal(usdtPerA, 1)} %`,
          `${roundToDecimal(+dataB.breakdown.USDT.amount, 2)}`,
          `${roundToDecimal(+dataB.breakdown.USDT.fairValue, 2)}`,
          `${roundToDecimal(usdtPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total user deposits',
          `—`,
          `$ ${roundToDecimal(totalFairValueA, 2)}`,
          `${roundToDecimal(totalPerA, 1)} %`,
          `—`,
          `$ ${roundToDecimal(totalFairValueB, 2)}`,
          `${roundToDecimal(totalPerB, 1)} %`,
        ],
      },
    ],
  };
  return result;
};

export const createFairValueTable = (dateStr: string, data: IBalanceSheet | undefined) => {
  const thead = ['', dateStr, '*-*', '*-*', '*-*'];
  const defaultTable: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '($ in thousands)', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.titleRow,
        rowData: ['Assets', 'Level 1', 'Level 2', 'Level 3', 'Total'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash and cash equivalents', `$ —`, '—', '—', `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency', `—`, '—', '—', `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Account receivable', `—`, '—', '—', `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total assets', `$ —`, '—', '—', `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['User deposits', `$ —`, '—', '—', `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Accounts payable', `—`, '—', '—', `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total liabilities', `$ —`, '—', '—', `$ —`],
      },
    ],
  };
  if (!data) return defaultTable;

  const result: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '($ in thousands)', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.titleRow,
        rowData: ['Assets', 'Level 1', 'Level 2', 'Level 3', 'Total'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash and cash equivalents',
          `$ ${roundToDecimal(+data.assets.details.cashAndCashEquivalent.weightedAverageCost, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.assets.details.cashAndCashEquivalent.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency',
          `${roundToDecimal(+data.assets.details.cryptocurrency.weightedAverageCost, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.assets.details.cryptocurrency.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Account receivable',
          `${roundToDecimal(+data.assets.details.accountsReceivable.weightedAverageCost, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.assets.details.accountsReceivable.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total assets',
          `$ ${roundToDecimal(+data.assets.weightedAverageCost, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.assets.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'User deposits',
          `$ ${roundToDecimal(+data.liabilities.details.userDeposit.weightedAverageCost, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.liabilities.details.userDeposit.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Accounts payable',
          `${roundToDecimal(+data.liabilities.details.accountsPayable.weightedAverageCost, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.liabilities.details.accountsPayable.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liabilities',
          `$ ${roundToDecimal(+data.liabilities.weightedAverageCost, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.liabilities.totalAmountFairValue, 2)}`,
        ],
      },
    ],
  };
  return result;
};
