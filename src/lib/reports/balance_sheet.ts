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
        rowData: ['A019 Cash and cash equivalents', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A001 Cryptocurrencies', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A020 Accounts receivable', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A004 Total current assets', `—`, `—`],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Non-current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A021 Total non-current assets', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['A005 Total assets', `$ —`, `$ —`],
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
        rowData: ['A006 User deposits', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A031 Accounts payable', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['A009 Total liabilities', `—`, `—`],
      },
      {
        rowType: RowType.title,
        rowData: [`Stockholders' equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A022 Capital', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A010 Retained earnings', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A052 Other capital reserve', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`A013 Total stockholders' equity`, `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: [`A014 Total liabilities and stockholders' equity`, `$ —`, `$ —`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const defaultData = {
    weightedAverageCost: 0,
    totalAmountFairValue: 0,
  };

  const cashAndCashEquivalentA = dataA.assets.details.cashAndCashEquivalent ?? defaultData;
  const cashAndCashEquivalentB = dataB.assets.details.cashAndCashEquivalent ?? defaultData;

  const cryptocurrencyA = dataA.assets.details.cryptocurrency ?? defaultData;
  const cryptocurrencyB = dataB.assets.details.cryptocurrency ?? defaultData;

  const accountsReceivableA = dataA.assets.details.accountsReceivable ?? defaultData;
  const accountsReceivableB = dataB.assets.details.accountsReceivable ?? defaultData;

  const assetsA = dataA.assets ?? defaultData;
  const assetsB = dataB.assets ?? defaultData;

  const nonAssetsA = dataA.nonAssets ?? defaultData;
  const nonAssetsB = dataB.nonAssets ?? defaultData;

  const totalAssetsA = dataA.totalAssetsFairValue ?? 0;
  const totalAssetsB = dataB.totalAssetsFairValue ?? 0;

  const userDepositA = dataA.liabilities.details.userDeposit ?? defaultData;
  const userDepositB = dataB.liabilities.details.userDeposit ?? defaultData;

  const accountsPayableA = dataA.liabilities.details.accountsPayable ?? defaultData;
  const accountsPayableB = dataB.liabilities.details.accountsPayable ?? defaultData;

  const liabilitiesA = dataA.liabilities ?? defaultData;
  const liabilitiesB = dataB.liabilities ?? defaultData;

  const capitalA = dataA.equity.details.capital ?? defaultData;
  const capitalB = dataB.equity.details.capital ?? defaultData;

  const retainedEarningsA = dataA.equity.details.retainedEarnings ?? defaultData;
  const retainedEarningsB = dataB.equity.details.retainedEarnings ?? defaultData;

  const otherCapitalReserveA = dataA.equity.details.otherCapitalReserve ?? defaultData;
  const otherCapitalReserveB = dataB.equity.details.otherCapitalReserve ?? defaultData;

  const equityA = dataA.equity ?? defaultData;
  const equityB = dataB.equity ?? defaultData;

  const totalLiabilitiesAndEquityFairValueA = dataA.totalLiabilitiesAndEquityFairValue ?? 0;
  const totalLiabilitiesAndEquityFairValueB = dataB.totalLiabilitiesAndEquityFairValue ?? 0;

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
          'A019 Cash and cash equivalents',
          `$ ${roundToDecimal(+cashAndCashEquivalentA.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+cashAndCashEquivalentB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A001 Cryptocurrencies',
          `${roundToDecimal(+cryptocurrencyA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+cryptocurrencyB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A020 Accounts receivable',
          `${roundToDecimal(+accountsReceivableA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+accountsReceivableB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A004 Total current assets',
          `${roundToDecimal(+assetsA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+assetsB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Non-current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A021 Total non-current assets',
          `${roundToDecimal(+nonAssetsA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+nonAssetsB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A005 Total assets',
          `$ ${roundToDecimal(+totalAssetsA, 2)}`,
          `$ ${roundToDecimal(+totalAssetsB, 2)}`,
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
          'A006 User deposits',
          `${roundToDecimal(+userDepositA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+userDepositB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A031 Accounts payable',
          `${roundToDecimal(+accountsPayableA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+accountsPayableB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A009 Total liabilities',
          `${roundToDecimal(+liabilitiesA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+liabilitiesB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: [`Stockholders' equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A022 Capital',
          `${roundToDecimal(+capitalA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+capitalB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A010 Retained earnings',
          `${roundToDecimal(+retainedEarningsA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+retainedEarningsB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A052 Other capital reserve',
          `${roundToDecimal(+otherCapitalReserveA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+otherCapitalReserveB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `A013 Total stockholders' equity`,
          `${roundToDecimal(+equityA.weightedAverageCost, 2)}`,
          `${roundToDecimal(+equityB.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          `A014 Total liabilities and stockholders' equity`,
          `$ ${roundToDecimal(+totalLiabilitiesAndEquityFairValueA, 2)}`,
          `$ ${roundToDecimal(+totalLiabilitiesAndEquityFairValueB, 2)}`,
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
  dataB: IBalanceAccountingDetail | undefined,
  numero: string[]
) => {
  const thead = ['', dates[0], '*-*', '*-*', dates[1], '*-*', '*-*'];
  const defaultUsdItem = {
    rowType: RowType.bookkeeping,
    rowData: [`USD (${numero[4]})`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
  };
  const defaultTbody = [
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
      rowData: [`Bitcoin (${numero[1]})`, `—`, `—`, `— %`, `—`, `—`, `— %`],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [`Ethereum (${numero[2]})`, `—`, `—`, `— %`, `—`, `—`, `— %`],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [`USDT (${numero[3]})`, `—`, `—`, `— %`, `—`, `—`, `— %`],
    },
    {
      rowType: RowType.foot,
      rowData: [`${numero[0]} Total ${title}`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
    },
  ];

  if (!dataA || !dataB) {
    // Info: (20231011 - Julian) cryptocurrencies table doesn't have USD
    if (title === 'cryptocurrencies')
      return {
        thead,
        tbody: defaultTbody,
      };

    defaultTbody.splice(1, 0, defaultUsdItem);
    return {
      thead,
      tbody: defaultTbody,
    };
  }

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
      `USD (${numero[4]})`,
      `${roundToDecimal(+usdA.amount, 2)}`,
      `$ ${roundToDecimal(+usdA.fairValue, 2)}`,
      `${roundToDecimal(usdPerA, 1)} %`,
      `${roundToDecimal(+usdB.amount, 2)}`,
      `$ ${roundToDecimal(+usdB.fairValue, 2)}`,
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
        `Bitcoin (${numero[1]})`,
        `${roundToDecimal(+btcA.amount, 2)}`,
        `${roundToDecimal(+btcA.fairValue, 2)}`,
        `${roundToDecimal(btcPerA, 1)} %`,
        `${roundToDecimal(+btcB.amount, 2)}`,
        `${roundToDecimal(+btcB.fairValue, 2)}`,
        `${roundToDecimal(btcPerB, 1)}%`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `Ethereum (${numero[2]})`,
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
        `USDT (${numero[3]})`,
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
        `${numero[0]} Total ${title}`,
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
        rowData: ['A019 Cash and cash equivalents', `$ —`, '—', '—', `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A001 Cryptocurrencies', `—`, '—', '—', `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A020 Accounts receivable', `—`, '—', '—', `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['A005 Total assets', `$ —`, '—', '—', `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A006 User deposits', `$ —`, '—', '—', `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['A031 Accounts payable', `—`, '—', '—', `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['A009 Total liabilities', `$ —`, '—', '—', `$ —`],
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
          'A019 Cash and cash equivalents',
          `$ ${roundToDecimal(+data.assets.details.cashAndCashEquivalent.weightedAverageCost, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.assets.details.cashAndCashEquivalent.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A001 Cryptocurrencies',
          `${roundToDecimal(+data.assets.details.cryptocurrency.weightedAverageCost, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.assets.details.cryptocurrency.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A020 Accounts receivable',
          `${roundToDecimal(+data.assets.details.accountsReceivable.weightedAverageCost, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.assets.details.accountsReceivable.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A005 Total assets',
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
          'A006 User deposits',
          `$ ${roundToDecimal(+data.liabilities.details.userDeposit.weightedAverageCost, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.liabilities.details.userDeposit.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A031 Accounts payable',
          `${roundToDecimal(+data.liabilities.details.accountsPayable.weightedAverageCost, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.liabilities.details.accountsPayable.totalAmountFairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A009 Total liabilities',
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
