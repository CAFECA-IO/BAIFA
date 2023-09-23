import {
  IComprehensiveIncomeStatements,
  IIncomeAccountingDetail,
} from '../../interfaces/comprehensive_income_statements';
import {roundToDecimal, getChange} from '../../lib/common';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';

export const createCISFirstPart = (
  thead: string[],
  endedDate: string,
  dataA: IComprehensiveIncomeStatements | undefined,
  dataB: IComprehensiveIncomeStatements | undefined
) => {
  const subThead = [
    'Comprehensive Income Statements - USD ($)',
    `30 Days Ended ${endedDate},`,
    '*-*',
  ];
  const defaultTable: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revene:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Trading fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Spread Fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Withdrawal fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Deposit fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Liquidation fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Guaranteed stop loss fee', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total revenue', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Technical supplier costs', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Market data supplier costs', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['New coin listing cost', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total cost', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Employee salaries', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Rent', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Marketing', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Rebate expenses', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total operating expenses', `$ —`, `$ —`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  // Info: (20230921 - Julian) total revenue
  const totalRevenueA =
    +dataA.income.details.transactionFee.weightedAverageCost +
    +dataA.income.details.spreadFee.weightedAverageCost +
    +dataA.income.details.withdrawalFee.weightedAverageCost +
    +dataA.income.details.depositFee.weightedAverageCost +
    +dataA.income.details.liquidationFee.weightedAverageCost +
    +dataA.income.details.guaranteedStopFee.weightedAverageCost;
  const totalRevenueB =
    +dataB.income.details.transactionFee.weightedAverageCost +
    +dataB.income.details.spreadFee.weightedAverageCost +
    +dataB.income.details.withdrawalFee.weightedAverageCost +
    +dataB.income.details.depositFee.weightedAverageCost +
    +dataB.income.details.liquidationFee.weightedAverageCost +
    +dataB.income.details.guaranteedStopFee.weightedAverageCost;

  // Info: (20230921 - Julian) total cost
  const totalCostA =
    +dataA.costs.details.technicalProviderFee +
    +dataA.costs.details.marketDataProviderFee +
    +dataA.costs.details.newCoinListingCost;
  const totalCostB =
    +dataB.costs.details.technicalProviderFee +
    +dataB.costs.details.marketDataProviderFee +
    +dataB.costs.details.newCoinListingCost;

  // Info: (20230921 - Julian) total operating expenses
  const totalOperatingExpensesA =
    +dataA.operatingExpenses.details.salaries +
    +dataA.operatingExpenses.details.rent +
    +dataA.operatingExpenses.details.marketing +
    +dataA.operatingExpenses.details.commissionRebates;
  const totalOperatingExpensesB =
    +dataB.operatingExpenses.details.salaries +
    +dataB.operatingExpenses.details.rent +
    +dataB.operatingExpenses.details.marketing +
    +dataB.operatingExpenses.details.commissionRebates;

  const result: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revene:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Trading fee',
          `${roundToDecimal(+dataA.income.details.transactionFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.transactionFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Spread Fee',
          `${roundToDecimal(+dataA.income.details.spreadFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.spreadFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Withdrawal fee',
          `${roundToDecimal(+dataA.income.details.withdrawalFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.withdrawalFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Deposit fee',
          `${roundToDecimal(+dataA.income.details.depositFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.depositFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Liquidation fee',
          `${roundToDecimal(+dataA.income.details.liquidationFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.liquidationFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Guaranteed stop loss fee',
          `${roundToDecimal(+dataA.income.details.guaranteedStopFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.guaranteedStopFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total revenue',
          `$ ${roundToDecimal(totalRevenueA, 2)}`,
          `$ ${roundToDecimal(totalRevenueB, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Technical supplier costs',
          `${roundToDecimal(+dataA.costs.details.technicalProviderFee, 2)}`,
          `${roundToDecimal(+dataB.costs.details.technicalProviderFee, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Market data supplier costs',
          `${roundToDecimal(+dataA.costs.details.marketDataProviderFee, 2)}`,
          `${roundToDecimal(+dataB.costs.details.marketDataProviderFee, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'New coin listing cost',
          `${roundToDecimal(+dataA.costs.details.newCoinListingCost, 2)}`,
          `${roundToDecimal(+dataB.costs.details.newCoinListingCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total cost', `$ ${totalCostA}`, `$ ${totalCostB}`],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Employee salaries',
          `${roundToDecimal(+dataA.operatingExpenses.details.salaries, 2)}`,
          `${roundToDecimal(+dataB.operatingExpenses.details.salaries, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Rent',
          `${roundToDecimal(+dataA.operatingExpenses.details.rent, 2)}`,
          `${roundToDecimal(+dataB.operatingExpenses.details.rent, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Marketing',
          `${roundToDecimal(+dataA.operatingExpenses.details.marketing, 2)}`,
          `${roundToDecimal(+dataB.operatingExpenses.details.marketing, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Rebate expenses',
          `${roundToDecimal(+dataA.operatingExpenses.details.commissionRebates, 2)}`,
          `${roundToDecimal(+dataB.operatingExpenses.details.commissionRebates, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total operating expenses',
          `$ ${roundToDecimal(totalOperatingExpensesA, 2)}`,
          `$ ${roundToDecimal(totalOperatingExpensesB, 2)}`,
        ],
      },
    ],
  };
  return result;
};

export const createCISLastPart = (
  dataA: IComprehensiveIncomeStatements | undefined,
  dataB: IComprehensiveIncomeStatements | undefined
) => {
  const defaultTable: ITable = {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Financial costs:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Interest expense', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency forex losses', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Fiat to cryptocurrency conversion losses', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency to fiat conversion losses', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Fiat to fiat conversion losses', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total financial costs', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Investment gains', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Forex gains', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency gains', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Total other gains', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net profit', `$ —`, `$ —`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const totalFinancialCostsA =
    +dataA.financialCosts.details.interestExpense +
    +dataA.financialCosts.details.cryptocurrencyForexLosses +
    +dataA.financialCosts.details.fiatToCryptocurrencyConversionLosses +
    +dataA.financialCosts.details.cryptocurrencyToFiatConversionLosses +
    +dataA.financialCosts.details.fiatToFiatConversionLosses;
  const totalFinancialCostsB =
    +dataB.financialCosts.details.interestExpense +
    +dataB.financialCosts.details.cryptocurrencyForexLosses +
    +dataB.financialCosts.details.fiatToCryptocurrencyConversionLosses +
    +dataB.financialCosts.details.cryptocurrencyToFiatConversionLosses +
    +dataB.financialCosts.details.fiatToFiatConversionLosses;

  const totalOtherGainsA =
    +dataA.otherGainsLosses.details.investmentGains +
    +dataA.otherGainsLosses.details.forexGains +
    +dataA.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost;
  const totalOtherGainsB =
    +dataB.otherGainsLosses.details.investmentGains +
    +dataB.otherGainsLosses.details.forexGains +
    +dataB.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost;

  return {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Financial costs:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Interest expense',
          `${roundToDecimal(+dataA.financialCosts.details.interestExpense, 2)}`,
          `${roundToDecimal(+dataB.financialCosts.details.interestExpense, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency forex losses',
          `${roundToDecimal(+dataA.financialCosts.details.cryptocurrencyForexLosses, 2)}`,
          `${roundToDecimal(+dataB.financialCosts.details.cryptocurrencyForexLosses, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Fiat to cryptocurrency conversion losses',
          `${roundToDecimal(
            +dataA.financialCosts.details.fiatToCryptocurrencyConversionLosses,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financialCosts.details.fiatToCryptocurrencyConversionLosses,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency to fiat conversion losses',
          `${roundToDecimal(
            +dataA.financialCosts.details.cryptocurrencyToFiatConversionLosses,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financialCosts.details.cryptocurrencyToFiatConversionLosses,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Fiat to fiat conversion losses',
          `${roundToDecimal(+dataA.financialCosts.details.fiatToFiatConversionLosses, 2)}`,
          `${roundToDecimal(+dataB.financialCosts.details.fiatToFiatConversionLosses, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total financial costs',
          `$ ${totalFinancialCostsA}`,
          `$ ${totalFinancialCostsB}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Investment gains',
          `${roundToDecimal(+dataA.otherGainsLosses.details.investmentGains, 2)}`,
          `${roundToDecimal(+dataB.otherGainsLosses.details.investmentGains, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Forex gains',
          `${roundToDecimal(+dataA.otherGainsLosses.details.forexGains, 2)}`,
          `${roundToDecimal(+dataB.otherGainsLosses.details.forexGains, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency gains',
          `${roundToDecimal(
            +dataA.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total other gains',
          `${roundToDecimal(totalOtherGainsA, 2)}`,
          `${roundToDecimal(totalOtherGainsB, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Net profit',
          `$ ${roundToDecimal(+dataA.netProfit, 2)}`,
          `$ ${roundToDecimal(+dataB.netProfit, 2)}`,
        ],
      },
    ],
  };
};

export const createRevenueTable = (
  title: string,
  date: string[],
  dataA: IIncomeAccountingDetail | undefined,
  dataB: IIncomeAccountingDetail | undefined
) => {
  const thead = [`${title}`, date[0], '*-*', '*-*', date[1], '*-*', '*-*'];
  const defaultTable: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '(Cost Value in thousands)',
          'Amount',
          'Cost Value',
          'Percentage of Total',
          'Amount',
          'Cost Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`USD`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Bitcoin`, `—`, `—`, `— %`, `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Ethereum`, `—`, `—`, `— %`, `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`USDT`, `—`, `—`, `— %`, `—`, `—`, `— %`],
      },
      {
        rowType: RowType.foot,
        rowData: [`Total ${title}`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const usdA = dataA.breakdown.USD;
  const usdB = dataB.breakdown.USD;

  const bitA = dataA.breakdown.BTC;
  const bitB = dataB.breakdown.BTC;

  const ethA = dataA.breakdown.ETH;
  const ethB = dataB.breakdown.ETH;

  const usdtA = dataA.breakdown.USDT;
  const usdtB = dataB.breakdown.USDT;

  const totalCostA = +dataA.weightedAverageCost;
  const totalCostB = +dataB.weightedAverageCost;

  // Info: (20230921 - Julian) Percentage
  const usdPerA = (+usdA.weightedAverageCost / totalCostA) * 100;
  const usdPerB = (+usdB.weightedAverageCost / totalCostB) * 100;

  const bitPerA = (+bitA.weightedAverageCost / totalCostA) * 100;
  const bitPerB = (+bitB.weightedAverageCost / totalCostB) * 100;

  const ethPerA = (+ethA.weightedAverageCost / totalCostA) * 100;
  const ethPerB = (+ethB.weightedAverageCost / totalCostB) * 100;

  const usdtPerA = (+usdtA.weightedAverageCost / totalCostA) * 100;
  const usdtPerB = (+usdtB.weightedAverageCost / totalCostB) * 100;

  const totalPerA = usdPerA + bitPerA + ethPerA + usdtPerA;
  const totalPerB = usdPerB + bitPerB + ethPerB + usdtPerB;

  const tbody = [
    {
      rowType: RowType.stringRow,
      rowData: [
        '(Cost Value in thousands)',
        'Amount',
        'Cost Value',
        'Percentage of Total',
        'Amount',
        'Cost Value',
        'Percentage of Total',
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `USD`,
        `${roundToDecimal(+usdA.amount, 2)}`,
        `$ ${roundToDecimal(+usdA.weightedAverageCost, 2)}`,
        `${roundToDecimal(usdPerA, 1)} %`,
        `${roundToDecimal(+usdB.amount, 2)}`,
        `$ ${roundToDecimal(+usdB.weightedAverageCost, 2)}`,
        `${roundToDecimal(usdPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `Bitcoin`,
        `${roundToDecimal(+bitA.amount, 2)}`,
        `${roundToDecimal(+bitA.weightedAverageCost, 2)}`,
        `${roundToDecimal(bitPerA, 1)} %`,
        `${roundToDecimal(+bitB.amount, 2)}`,
        `${roundToDecimal(+bitB.weightedAverageCost, 2)}`,
        `${roundToDecimal(bitPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `Ethereum`,
        `${roundToDecimal(+ethA.amount, 2)}`,
        `${roundToDecimal(+ethA.weightedAverageCost, 2)}`,
        `${roundToDecimal(ethPerA, 1)} %`,
        `${roundToDecimal(+ethB.amount, 2)}`,
        `${roundToDecimal(+ethB.weightedAverageCost, 2)}`,
        `${roundToDecimal(ethPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `USDT`,
        `${roundToDecimal(+usdtA.amount, 2)}`,
        `${roundToDecimal(+usdtA.weightedAverageCost, 2)}`,
        `${roundToDecimal(usdtPerA, 1)} %`,
        `${roundToDecimal(+usdtB.amount, 2)}`,
        `${roundToDecimal(+usdtB.weightedAverageCost, 2)}`,
        `${roundToDecimal(usdtPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.foot,
      rowData: [
        `Total ${title}`,
        `—`,
        `$ ${roundToDecimal(+totalCostA, 2)}`,
        `${roundToDecimal(totalPerA, 1)} %`,
        `—`,
        `$ ${roundToDecimal(+totalCostB, 2)}`,
        `${roundToDecimal(totalPerB, 1)} %`,
      ],
    },
  ];

  const result: ITable = {
    thead,
    tbody,
  };
  return result;
};

export const createRevenueChangeTable = (
  endedDate: string,
  TheadDates: string[],
  thisYearData: IComprehensiveIncomeStatements | undefined,
  lastYearData: IComprehensiveIncomeStatements | undefined
) => {
  const subThead = ['', `30 Days Ended ${endedDate},`, '*-*', '*-*'];
  const thead = ['', TheadDates[0], TheadDates[1], '% Change'];
  const defaultTable: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Trading fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Spread Fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Withdrawal fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Deposit fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Liquidation fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Guaranteed stop loss fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total revenue', `$ —`, `$ —`, `— %`],
      },
    ],
  };
  if (!thisYearData || !lastYearData) return defaultTable;

  const thisYearTradingFee = +thisYearData.income.details.transactionFee.weightedAverageCost;
  const lastYearTradingFee = +lastYearData.income.details.transactionFee.weightedAverageCost;
  const tradingFeeChange = getChange(thisYearTradingFee, lastYearTradingFee) * 100;

  const thisYearSpreadFee = +thisYearData.income.details.spreadFee.weightedAverageCost;
  const lastYearSpreadFee = +lastYearData.income.details.spreadFee.weightedAverageCost;
  const spreadFeeChange = getChange(thisYearSpreadFee, lastYearSpreadFee) * 100;

  const thisYearWithdrawalFee = +thisYearData.income.details.withdrawalFee.weightedAverageCost;
  const lastYearWithdrawalFee = +lastYearData.income.details.withdrawalFee.weightedAverageCost;
  const withdrawalFeeChange = getChange(thisYearWithdrawalFee, lastYearWithdrawalFee) * 100;

  const thisYearDepositFee = +thisYearData.income.details.depositFee.weightedAverageCost;
  const lastYearDepositFee = +lastYearData.income.details.depositFee.weightedAverageCost;
  const depositFeeChange = getChange(thisYearDepositFee, lastYearDepositFee) * 100;

  const thisYearLiquidationFee = +thisYearData.income.details.liquidationFee.weightedAverageCost;
  const lastYearLiquidationFee = +lastYearData.income.details.liquidationFee.weightedAverageCost;
  const liquidationFeeChange = getChange(thisYearLiquidationFee, lastYearLiquidationFee) * 100;

  const thisYearGuaranteedStopLossFee =
    +thisYearData.income.details.guaranteedStopFee.weightedAverageCost;
  const lastYearGuaranteedStopLossFee =
    +lastYearData.income.details.guaranteedStopFee.weightedAverageCost;
  const guaranteedStopLossFeeChange =
    getChange(thisYearGuaranteedStopLossFee, lastYearGuaranteedStopLossFee) * 100;

  const thisYearTotalRevenue =
    thisYearTradingFee +
    thisYearSpreadFee +
    thisYearWithdrawalFee +
    thisYearDepositFee +
    thisYearLiquidationFee +
    thisYearGuaranteedStopLossFee;
  const lastYearTotalRevenue =
    lastYearTradingFee +
    lastYearSpreadFee +
    lastYearWithdrawalFee +
    lastYearDepositFee +
    lastYearLiquidationFee +
    lastYearGuaranteedStopLossFee;
  const totalRevenueChange = getChange(thisYearTotalRevenue, lastYearTotalRevenue) * 100;

  const result: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Trading fee',
          `${roundToDecimal(thisYearTradingFee, 2)}`,
          `${roundToDecimal(lastYearTradingFee, 2)}`,
          `${roundToDecimal(tradingFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Spread Fee',
          `${roundToDecimal(thisYearSpreadFee, 2)}`,
          `${roundToDecimal(lastYearSpreadFee, 2)}`,
          `${roundToDecimal(spreadFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Withdrawal fee',
          `${roundToDecimal(thisYearWithdrawalFee, 2)}`,
          `${roundToDecimal(lastYearWithdrawalFee, 2)}`,
          `${roundToDecimal(withdrawalFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Deposit fee',
          `${roundToDecimal(thisYearDepositFee, 2)}`,
          `${roundToDecimal(lastYearDepositFee, 2)}`,
          `${roundToDecimal(depositFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Liquidation fee',
          `${roundToDecimal(thisYearLiquidationFee, 2)}`,
          `${roundToDecimal(lastYearLiquidationFee, 2)}`,
          `${roundToDecimal(liquidationFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Guaranteed stop loss fee',
          `${roundToDecimal(thisYearGuaranteedStopLossFee, 2)}`,
          `${roundToDecimal(lastYearGuaranteedStopLossFee, 2)}`,
          `${roundToDecimal(guaranteedStopLossFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total revenue',
          `$ ${roundToDecimal(thisYearTotalRevenue, 2)}`,
          `$ ${roundToDecimal(lastYearTotalRevenue, 2)}`,
          `${roundToDecimal(totalRevenueChange, 1)} %`,
        ],
      },
    ],
  };
  return result;
};
