import {IBalanceSheet, IBalanceAccountingDetail} from '../../interfaces/balance_sheet';
import {roundToDecimal} from '../../lib/common';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';
import {ICurrencyDetail} from '../../interfaces/report_currency_detail';

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
          `$ ${roundToDecimal(+dataA.totalAssetsFairValue, 2)}`,
          `$ ${roundToDecimal(+dataB.totalAssetsFairValue, 2)}`,
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
          `$ ${roundToDecimal(+dataA.totalLiabilitiesAndEquityFairValue, 2)}`,
          `$ ${roundToDecimal(+dataB.totalLiabilitiesAndEquityFairValue, 2)}`,
        ],
      },
    ],
  };
  return result;
};

export const createSummaryTable = (
  title: string,
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
        rowData: [`Total ${title}`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const totalFairValueA = +dataA.totalAmountFairValue;
  const totalFairValueB = +dataB.totalAmountFairValue;

  const defaultCurrencyData = {
    amount: 0,
    fairValue: 0,
  };

  const getCurrData = (data: ICurrencyDetail | undefined) => {
    if (!data) return defaultCurrencyData;
    return {
      amount: +data.amount,
      fairValue: +data.fairValue,
    };
  };

  const btcA = getCurrData(dataA.breakdown.BTC);
  const btcB = getCurrData(dataB.breakdown.BTC);
  const ethA = getCurrData(dataA.breakdown.ETH);
  const ethB = getCurrData(dataB.breakdown.ETH);
  const usdtA = getCurrData(dataA.breakdown.USDT);
  const usdtB = getCurrData(dataB.breakdown.USDT);
  const usdA = getCurrData(dataA.breakdown.USD);
  const usdB = getCurrData(dataB.breakdown.USD);

  const btcPerA = (+btcA.fairValue / totalFairValueA) * 100;
  const btcPerB = (+btcB.fairValue / totalFairValueB) * 100;
  const ethPerA = (+ethA.fairValue / totalFairValueA) * 100;
  const ethPerB = (+ethB.fairValue / totalFairValueB) * 100;
  const usdtPerA = (+usdtA.fairValue / totalFairValueA) * 100;
  const usdtPerB = (+usdtB.fairValue / totalFairValueB) * 100;
  const usdPerA = (+usdA.fairValue / totalFairValueA) * 100;
  const usdPerB = (+usdB.fairValue / totalFairValueB) * 100;

  const totalPerA = btcPerA + ethPerA + usdtPerA + usdPerA;
  const totalPerB = btcPerB + ethPerB + usdtPerB + usdPerB;

  const usdItem = {
    rowType: RowType.bookkeeping,
    rowData: [
      'USD',
      `${roundToDecimal(+usdA.amount, 2)}`,
      `${roundToDecimal(+usdA.fairValue, 2)}`,
      `${roundToDecimal(usdPerA, 1)} %`,
      `${roundToDecimal(+usdB.amount, 2)}`,
      `${roundToDecimal(+usdB.fairValue, 2)}`,
      `${roundToDecimal(usdPerB, 1)} %`,
    ],
  };

  const resultTBody = [
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
        `${roundToDecimal(+btcA.amount, 2)}`,
        `$ ${roundToDecimal(+btcA.fairValue, 2)}`,
        `${roundToDecimal(btcPerA, 1)} %`,
        `${roundToDecimal(+btcB.amount, 2)}`,
        `$ ${roundToDecimal(+btcB.fairValue, 2)}`,
        `${roundToDecimal(btcPerB, 1)}%`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        'Ethereum',
        `${roundToDecimal(+ethA.amount, 2)}`,
        `${roundToDecimal(+ethA.fairValue, 2)}`,
        `${roundToDecimal(ethPerA, 1)} %`,
        `${roundToDecimal(+ethB.amount, 2)}`,
        `${roundToDecimal(+ethB.fairValue, 2)}`,
        `${roundToDecimal(ethPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        'USDT',
        `${roundToDecimal(+usdtA.amount, 2)}`,
        `${roundToDecimal(+usdtA.fairValue, 2)}`,
        `${roundToDecimal(usdtPerA, 1)} %`,
        `${roundToDecimal(+usdtB.amount, 2)}`,
        `${roundToDecimal(+usdtB.fairValue, 2)}`,
        `${roundToDecimal(usdtPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.foot,
      rowData: [
        `Total ${title}`,
        `—`,
        `$ ${roundToDecimal(totalFairValueA, 2)}`,
        `${roundToDecimal(totalPerA, 1)} %`,
        `—`,
        `$ ${roundToDecimal(totalFairValueB, 2)}`,
        `${roundToDecimal(totalPerB, 1)} %`,
      ],
    },
  ];

  // Info: (20231011 - Julian) cryptocurrencies table doesn't have USD
  if (title === 'cryptocurrencies')
    return {
      thead,
      tbody: resultTBody,
    };

  resultTBody.splice(1, 0, usdItem);
  return {
    thead,
    tbody: resultTBody,
  };
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
