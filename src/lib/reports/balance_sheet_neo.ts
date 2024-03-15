import {
  IBalanceSheetsNeo,
  ICurrencyDetail,
  ICryptocurrencyDetail,
} from '../../interfaces/balance_sheets_neo';
import {roundToDecimal} from '../common';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';

export const createBalanceSheetsTable = (
  dates: string[],
  dataA: IBalanceSheetsNeo | undefined,
  dataB: IBalanceSheetsNeo | undefined
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
        rowData: ['A006 User deposits', `$ —`, `$ —`],
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
    fairValue: 0,
  };

  const cashAndCashEquivalentA = dataA.assets.details.cashAndCashEquivalent ?? defaultData;
  const cashAndCashEquivalentB = dataB.assets.details.cashAndCashEquivalent ?? defaultData;

  const cryptocurrencyA = defaultData; //dataA.assets.details.cryptocurrency ?? defaultData;
  const cryptocurrencyB = defaultData; //dataB.assets.details.cryptocurrency ?? defaultData;

  const accountsReceivableA = dataA.assets.details.accountsReceivable ?? defaultData;
  const accountsReceivableB = dataB.assets.details.accountsReceivable ?? defaultData;

  const assetsA = dataA.assets ?? defaultData;
  const assetsB = dataB.assets ?? defaultData;

  const nonAssetsA = defaultData; //dataA.nonAssets ?? defaultData;
  const nonAssetsB = defaultData; //dataB.nonAssets ?? defaultData;

  const totalAssetsA = dataA.totalAssetsFairValue ?? 0;
  const totalAssetsB = dataB.totalAssetsFairValue ?? 0;

  const userDepositA = dataA.liabilities.details.userDeposit ?? defaultData;
  const userDepositB = dataB.liabilities.details.userDeposit ?? defaultData;

  const accountsPayableA = dataA.liabilities.details.accountsPayable ?? defaultData;
  const accountsPayableB = dataB.liabilities.details.accountsPayable ?? defaultData;

  const liabilitiesA = dataA.liabilities ?? defaultData;
  const liabilitiesB = dataB.liabilities ?? defaultData;

  const capitalA = defaultData; //dataA.equity.details.capital ?? defaultData;
  const capitalB = defaultData; //dataB.equity.details.capital ?? defaultData;

  const retainedEarningsA = dataA.equity.details.retainedEarning ?? defaultData;
  const retainedEarningsB = dataB.equity.details.retainedEarning ?? defaultData;

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
          `$ ${roundToDecimal(+cashAndCashEquivalentA.fairValue, 2)}`,
          `$ ${roundToDecimal(+cashAndCashEquivalentB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A001 Cryptocurrencies',
          `${roundToDecimal(+cryptocurrencyA.fairValue, 2)}`,
          `${roundToDecimal(+cryptocurrencyB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A020 Accounts receivable',
          `${roundToDecimal(+accountsReceivableA.fairValue, 2)}`,
          `${roundToDecimal(+accountsReceivableB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A004 Total current assets',
          `${roundToDecimal(+assetsA.fairValue, 2)}`,
          `${roundToDecimal(+assetsB.fairValue, 2)}`,
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
          `${roundToDecimal(+nonAssetsA.fairValue, 2)}`,
          `${roundToDecimal(+nonAssetsB.fairValue, 2)}`,
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
          `$ ${roundToDecimal(+userDepositA.fairValue, 2)}`,
          `$ ${roundToDecimal(+userDepositB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A031 Accounts payable',
          `${roundToDecimal(+accountsPayableA.fairValue, 2)}`,
          `${roundToDecimal(+accountsPayableB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A009 Total liabilities',
          `${roundToDecimal(+liabilitiesA.fairValue, 2)}`,
          `${roundToDecimal(+liabilitiesB.fairValue, 2)}`,
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
          `${roundToDecimal(+capitalA.fairValue, 2)}`,
          `${roundToDecimal(+capitalB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A010 Retained earnings',
          `${roundToDecimal(+retainedEarningsA.fairValue, 2)}`,
          `${roundToDecimal(+retainedEarningsB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A052 Other capital reserve',
          `${roundToDecimal(+otherCapitalReserveA.fairValue, 2)}`,
          `${roundToDecimal(+otherCapitalReserveB.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `A013 Total stockholders' equity`,
          `${roundToDecimal(+equityA.fairValue, 2)}`,
          `${roundToDecimal(+equityB.fairValue, 2)}`,
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
  dataA: ICurrencyDetail | undefined,
  dataB: ICurrencyDetail | undefined,
  numero: string[]
) => {
  const thead = ['', dates[0], '*-*', '*-*', dates[1], '*-*', '*-*'];

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
      rowData: [`USD (${numero[4]})`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
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
    return {
      thead,
      tbody: defaultTbody,
    };
  }

  const totalFairValueA = +dataA.fairValue;
  const totalFairValueB = +dataB.fairValue;

  const defaultCurrencyData = {
    amount: 0,
    fairValue: 0,
  };

  // Info: (20240306 - Julian) ------- USD -------
  const usdA = dataA.breakdown.USD ?? defaultCurrencyData;
  const usdB = dataB.breakdown.USD ?? defaultCurrencyData;
  const usdPerA = (+usdA.fairValue / totalFairValueA) * 100;
  const usdPerB = (+usdB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- BTC -------
  const btcA = dataA.breakdown.BTC ?? defaultCurrencyData;
  const btcB = dataB.breakdown.BTC ?? defaultCurrencyData;
  const btcPerA = (+btcA.fairValue / totalFairValueA) * 100;
  const btcPerB = (+btcB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- ETH -------
  const ethA = dataA.breakdown.ETH ?? defaultCurrencyData;
  const ethB = dataB.breakdown.ETH ?? defaultCurrencyData;
  const ethPerA = (+ethA.fairValue / totalFairValueA) * 100;
  const ethPerB = (+ethB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- USDT -------
  const usdtA = dataA.breakdown.USDT ?? defaultCurrencyData;
  const usdtB = dataB.breakdown.USDT ?? defaultCurrencyData;
  const usdtPerA = (+usdtA.fairValue / totalFairValueA) * 100;
  const usdtPerB = (+usdtB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- Total -------
  const totalPerA = btcPerA + ethPerA + usdtPerA + usdPerA;
  const totalPerB = btcPerB + ethPerB + usdtPerB + usdPerB;

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
        `USD (${numero[4]})`,
        `${roundToDecimal(+usdA.amount, 2)}`,
        `$ ${roundToDecimal(+usdA.fairValue, 2)}`,
        `${roundToDecimal(usdPerA, 1)} %`,
        `${roundToDecimal(+usdB.amount, 2)}`,
        `$ ${roundToDecimal(+usdB.fairValue, 2)}`,
        `${roundToDecimal(usdPerB, 1)} %`,
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

  return {
    thead,
    tbody: resultTBody,
  };
};

export const createCryptocurrencyTable = (
  title: string,
  dates: string[],
  dataA: ICryptocurrencyDetail | undefined,
  dataB: ICryptocurrencyDetail | undefined,
  numero: string[]
) => {
  // Info: (20231011 - Julian) cryptocurrencies table doesn't have USD
  const thead = ['', dates[0], '*-*', '*-*', dates[1], '*-*', '*-*'];

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
      rowData: [`Bitcoin (${numero[1]})`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
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
    return {
      thead,
      tbody: defaultTbody,
    };
  }

  const totalFairValueA = +dataA.fairValue;
  const totalFairValueB = +dataB.fairValue;

  const defaultCurrencyData = {
    amount: 0,
    fairValue: 0,
  };

  // Info: (20240306 - Julian) ------- BTC -------
  const btcA = dataA.breakdown.BTC ?? defaultCurrencyData;
  const btcB = dataB.breakdown.BTC ?? defaultCurrencyData;
  const btcPerA = (+btcA.fairValue / totalFairValueA) * 100;
  const btcPerB = (+btcB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- ETH -------
  const ethA = dataA.breakdown.ETH ?? defaultCurrencyData;
  const ethB = dataB.breakdown.ETH ?? defaultCurrencyData;
  const ethPerA = (+ethA.fairValue / totalFairValueA) * 100;
  const ethPerB = (+ethB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- USDT -------
  const usdtA = dataA.breakdown.USDT ?? defaultCurrencyData;
  const usdtB = dataB.breakdown.USDT ?? defaultCurrencyData;
  const usdtPerA = (+usdtA.fairValue / totalFairValueA) * 100;
  const usdtPerB = (+usdtB.fairValue / totalFairValueB) * 100;

  // Info: (20240306 - Julian) ------- Total -------
  const totalPerA = btcPerA + ethPerA + usdtPerA;
  const totalPerB = btcPerB + ethPerB + usdtPerB;

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

  return {
    thead,
    tbody: resultTBody,
  };
};

export const createFairValueTable = (dateStr: string, data: IBalanceSheetsNeo | undefined) => {
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
          `$ ${roundToDecimal(+data.assets.details.cashAndCashEquivalent.fairValue, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.assets.details.cashAndCashEquivalent.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A001 Cryptocurrencies',
          `${roundToDecimal(+data.assets.details.cryptocurrency.fairValue, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.assets.details.cryptocurrency.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A020 Accounts receivable',
          `${roundToDecimal(+data.assets.details.accountsReceivable.fairValue, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.assets.details.accountsReceivable.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A005 Total assets',
          `$ ${roundToDecimal(+data.assets.fairValue, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.assets.fairValue, 2)}`,
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
          `$ ${roundToDecimal(+data.liabilities.details.userDeposit.fairValue, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.liabilities.details.userDeposit.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'A031 Accounts payable',
          `${roundToDecimal(+data.liabilities.details.accountsPayable.fairValue, 2)}`,
          '—',
          '—',
          `${roundToDecimal(+data.liabilities.details.accountsPayable.fairValue, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'A009 Total liabilities',
          `$ ${roundToDecimal(+data.liabilities.fairValue, 2)}`,
          '—',
          '—',
          `$ ${roundToDecimal(+data.liabilities.fairValue, 2)}`,
        ],
      },
    ],
  };
  return result;
};
