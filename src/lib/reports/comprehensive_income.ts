import {
  IComprehensiveIncomeStatements,
  IIncomeAccountingDetail,
} from '../../interfaces/comprehensive_income_statements';
import {defaultBreakdown} from '../../interfaces/report_currency_detail';
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
        rowData: ['Revenue:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B011 Trading fee', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B012 Spread Fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B005 Withdrawal fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B001 Deposit fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B013 Liquidation fee', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B014 Guaranteed stop-loss fee', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['B029 Total revenue', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B008 Technical supplier costs', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B015 Market data supplier costs', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B016 New coin listing cost', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['B030 Total cost', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B017 Employee salaries', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B018 Rent', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B019 Marketing', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B020 Rebate expenses', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['B031 Total operating expenses', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Financial costs:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B021 Interest expense', `$ —`, `$ —`],
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
        rowData: ['Revenue:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B011 Trading fee',
          `$ ${roundToDecimal(+dataA.income.details.tradingFee.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.income.details.tradingFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B012 Spread Fee',
          `${roundToDecimal(+dataA.income.details.spreadFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.spreadFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B005 Withdrawal fee',
          `${roundToDecimal(+dataA.income.details.withdrawalFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.withdrawalFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B001 Deposit fee',
          `${roundToDecimal(+dataA.income.details.depositFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.depositFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B013 Liquidation fee',
          `${roundToDecimal(+dataA.income.details.liquidationFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.liquidationFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B014 Guaranteed stop-loss fee',
          `${roundToDecimal(+dataA.income.details.guaranteedStopLossFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.income.details.guaranteedStopLossFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'B029 Total revenue',
          `$ ${roundToDecimal(+dataA.income.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.income.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B008 Technical supplier costs',
          `$ ${roundToDecimal(+dataA.costs.details.technicalProviderFee.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.costs.details.technicalProviderFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B015 Market data supplier costs',
          `${roundToDecimal(+dataA.costs.details.marketDataProviderFee.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.costs.details.marketDataProviderFee.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B016 New coin listing cost',
          `${roundToDecimal(+dataA.costs.details.newCoinListingCost.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.costs.details.newCoinListingCost.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'B030 Total cost',
          `$ ${roundToDecimal(+dataA.costs.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.costs.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B017 Employee salaries',
          `$ ${roundToDecimal(+dataA.operatingExpenses.details.salaries, 2)}`,
          `$ ${roundToDecimal(+dataB.operatingExpenses.details.salaries, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B018 Rent',
          `${roundToDecimal(+dataA.operatingExpenses.details.rent, 2)}`,
          `${roundToDecimal(+dataB.operatingExpenses.details.rent, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B019 Marketing',
          `${roundToDecimal(+dataA.operatingExpenses.details.marketing, 2)}`,
          `${roundToDecimal(+dataB.operatingExpenses.details.marketing, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B020 Rebate expenses',
          `${roundToDecimal(
            +dataA.operatingExpenses.details.rebateExpenses.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingExpenses.details.rebateExpenses.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'B031 Total operating expenses',
          `$ ${roundToDecimal(+dataA.operatingExpenses.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.operatingExpenses.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Financial costs:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B021 Interest expense',
          `$ ${roundToDecimal(+dataA.financialCosts.details.interestExpense, 2)}`,
          `$ ${roundToDecimal(+dataB.financialCosts.details.interestExpense, 2)}`,
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
        rowType: RowType.bookkeeping,
        rowData: ['B022 Cryptocurrency forex losses', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B023 Fiat to cryptocurrency conversion losses', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B024 Cryptocurrency to fiat conversion losses', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B025 Fiat to fiat conversion losses', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['B032 Total financial costs', `$ —`, `$ —`],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B026 Investment gains', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B027 Forex gains', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B028 Cryptocurrency gains', `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B033 Total other gains', `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: ['B004 Net profit', `$ —`, `$ —`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const b026ItemTitle =
    +dataA.otherGainsLosses.details.investmentGains >= 0
      ? 'B026 Investment gains'
      : 'B026 Investment losses';
  const b027ItemTitle =
    +dataA.otherGainsLosses.details.forexGains >= 0 ? 'B027 Forex gains' : 'B027 Forex losses';
  const b028ItemTitle =
    +dataA.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost >= 0
      ? 'B028 Cryptocurrency gains'
      : 'B028 Cryptocurrency losses';
  const b033ItemTitle =
    +dataA.otherGainsLosses.weightedAverageCost >= 0
      ? 'B033 Total other gains'
      : 'B033 Total other losses';

  return {
    tbody: [
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B022 Cryptocurrency forex losses',
          `${roundToDecimal(+dataA.financialCosts.details.cryptocurrencyForexLosses, 2)}`,
          `${roundToDecimal(+dataB.financialCosts.details.cryptocurrencyForexLosses, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B023 Fiat to cryptocurrency conversion losses',
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
          'B024 Cryptocurrency to fiat conversion losses',
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
          'B025 Fiat to fiat conversion losses',
          `${roundToDecimal(+dataA.financialCosts.details.fiatToFiatConversionLosses, 2)}`,
          `${roundToDecimal(+dataB.financialCosts.details.fiatToFiatConversionLosses, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'B032 Total financial costs',
          `$ ${roundToDecimal(+dataA.financialCosts.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.financialCosts.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          b026ItemTitle,
          `$ ${roundToDecimal(+dataA.otherGainsLosses.details.investmentGains, 2)}`,
          `$ ${roundToDecimal(+dataB.otherGainsLosses.details.investmentGains, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          b027ItemTitle,
          `${roundToDecimal(+dataA.otherGainsLosses.details.forexGains, 2)}`,
          `${roundToDecimal(+dataB.otherGainsLosses.details.forexGains, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          b028ItemTitle,
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
          b033ItemTitle,
          `${roundToDecimal(+dataA.otherGainsLosses.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.otherGainsLosses.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'B004 Net profit',
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
  dataB: IIncomeAccountingDetail | undefined,
  numero: string[]
) => {
  const thead = [`${numero[0]} ${title}`, date[0], '*-*', '*-*', date[1], '*-*', '*-*'];
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
        rowType: RowType.capitalFoot,
        rowData: [`Total ${title}`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const usdA = dataA.breakdown.USD ?? defaultBreakdown;
  const usdB = dataB.breakdown.USD ?? defaultBreakdown;

  const btcA = dataA.breakdown.BTC ?? defaultBreakdown;
  const btcB = dataB.breakdown.BTC ?? defaultBreakdown;

  const ethA = dataA.breakdown.ETH ?? defaultBreakdown;
  const ethB = dataB.breakdown.ETH ?? defaultBreakdown;

  const usdtA = dataA.breakdown.USDT ?? defaultBreakdown;
  const usdtB = dataB.breakdown.USDT ?? defaultBreakdown;

  const totalCostA = +dataA.weightedAverageCost;
  const totalCostB = +dataB.weightedAverageCost;

  // Info: (20230921 - Julian) Percentage
  const usdPerA = (+usdA.weightedAverageCost / totalCostA) * 100;
  const usdPerB = (+usdB.weightedAverageCost / totalCostB) * 100;

  const btcPerA = (+btcA.weightedAverageCost / totalCostA) * 100;
  const btcPerB = (+btcB.weightedAverageCost / totalCostB) * 100;

  const ethPerA = (+ethA.weightedAverageCost / totalCostA) * 100;
  const ethPerB = (+ethB.weightedAverageCost / totalCostB) * 100;

  const usdtPerA = (+usdtA.weightedAverageCost / totalCostA) * 100;
  const usdtPerB = (+usdtB.weightedAverageCost / totalCostB) * 100;

  const totalPerA = usdPerA + btcPerA + ethPerA + usdtPerA;
  const totalPerB = usdPerB + btcPerB + ethPerB + usdtPerB;

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
        `USD (${numero[4]})`,
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
        `Bitcoin (${numero[1]})`,
        `${roundToDecimal(+btcA.amount, 2)}`,
        `${roundToDecimal(+btcA.weightedAverageCost, 2)}`,
        `${roundToDecimal(btcPerA, 1)} %`,
        `${roundToDecimal(+btcB.amount, 2)}`,
        `${roundToDecimal(+btcB.weightedAverageCost, 2)}`,
        `${roundToDecimal(btcPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `Ethereum (${numero[2]})`,
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
        `USDT (${numero[3]})`,
        `${roundToDecimal(+usdtA.amount, 2)}`,
        `${roundToDecimal(+usdtA.weightedAverageCost, 2)}`,
        `${roundToDecimal(usdtPerA, 1)} %`,
        `${roundToDecimal(+usdtB.amount, 2)}`,
        `${roundToDecimal(+usdtB.weightedAverageCost, 2)}`,
        `${roundToDecimal(usdtPerB, 1)} %`,
      ],
    },
    {
      rowType: RowType.capitalFoot,
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
        rowData: ['Net revenue', '(in thousands)', '*-*', ''],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B011 Trading fee', `$ —`, `$ —`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B012 Spread Fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B005 Withdrawal fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B001 Deposit fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B001 Liquidation fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['B014 Guaranteed stop-loss fee', `—`, `—`, `— %`],
      },
      {
        rowType: RowType.foot,
        rowData: ['B029 Total revenue', `$ —`, `$ —`, `— %`],
      },
    ],
  };
  if (!thisYearData || !lastYearData) return defaultTable;

  const thisYearTradingFee = +thisYearData.income.details.tradingFee.weightedAverageCost;
  const lastYearTradingFee = +lastYearData.income.details.tradingFee.weightedAverageCost;
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
    +thisYearData.income.details.guaranteedStopLossFee.weightedAverageCost;
  const lastYearGuaranteedStopLossFee =
    +lastYearData.income.details.guaranteedStopLossFee.weightedAverageCost;
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
        rowData: ['Net revenue', '(in thousands)', '*-*', ''],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B011 Trading fee',
          `$ ${roundToDecimal(thisYearTradingFee, 2)}`,
          `$ ${roundToDecimal(lastYearTradingFee, 2)}`,
          `${roundToDecimal(tradingFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B012 Spread Fee',
          `${roundToDecimal(thisYearSpreadFee, 2)}`,
          `${roundToDecimal(lastYearSpreadFee, 2)}`,
          `${roundToDecimal(spreadFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B005 Withdrawal fee',
          `${roundToDecimal(thisYearWithdrawalFee, 2)}`,
          `${roundToDecimal(lastYearWithdrawalFee, 2)}`,
          `${roundToDecimal(withdrawalFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B001 Deposit fee',
          `${roundToDecimal(thisYearDepositFee, 2)}`,
          `${roundToDecimal(lastYearDepositFee, 2)}`,
          `${roundToDecimal(depositFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B001 Liquidation fee',
          `${roundToDecimal(thisYearLiquidationFee, 2)}`,
          `${roundToDecimal(lastYearLiquidationFee, 2)}`,
          `${roundToDecimal(liquidationFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'B014 Guaranteed stop-loss fee',
          `${roundToDecimal(thisYearGuaranteedStopLossFee, 2)}`,
          `${roundToDecimal(lastYearGuaranteedStopLossFee, 2)}`,
          `${roundToDecimal(guaranteedStopLossFeeChange, 1)} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'B029 Total revenue',
          `$ ${roundToDecimal(thisYearTotalRevenue, 2)}`,
          `$ ${roundToDecimal(lastYearTotalRevenue, 2)}`,
          `${roundToDecimal(totalRevenueChange, 1)} %`,
        ],
      },
    ],
  };
  return result;
};
