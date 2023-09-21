import {APIURL} from '../../constants/api_request';
import {IResult} from '../../interfaces/result';
import {
  IComprehensiveIncomeStatements,
  IIncomeAccountingDetail,
} from '../../interfaces/comprehensive_income_statements';
import {roundToDecimal} from '../../lib/common';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';

export const getComprehensiveIncomeStatements = async (date: string) => {
  let reportData;
  try {
    const response = await fetch(`${APIURL.COMPREHENSIVE_INCOME_STATEMENTS}?date=${date}`, {
      method: 'GET',
    });
    const result: IResult = await response.json();
    if (result.success) {
      reportData = result.data as IComprehensiveIncomeStatements;
    }
  } catch (error) {
    // console.log('Get comprehensive income statements error');
  }
  return reportData;
};

export const getCISData = (data: IComprehensiveIncomeStatements | undefined) => {
  if (!data)
    return {
      tradingFee: '0',
      spreadFee: '0',
      withdrawalFee: '0',
      depositFee: '0',
      liquidationFee: '0',
      guaranteedStopLossFee: '0',
      totalRevenue: '0',
      technicalSupplierCost: '0',
      marketDataSupplierCost: '0',
      newCoinListingCost: '0',
      totalCost: '0',
      employeeSalaries: '0',
      rent: '0',
      marketing: '0',
      rebateExpenses: '0',
      totalOperatingExpenses: '0',
      interestExpense: '0',
      cryptocurrencyForexLosses: '0',
      fiatToCryptocurrencyConversionLosses: '0',
      cryptocurrencyToFiatConversionLosses: '0',
      fiatToFiatConversionLosses: '0',
      totalFinancialCosts: '0',
      investmentGains: '0',
      forexGains: '0',
      cryptocurrencyGains: '0',
      totalOtherGains: '0',
      netProfit: '0',
    };

  // Info: (20230914 - Julian) ------------- Revene -------------
  const tradingFee = roundToDecimal(
    +data.income.details.transactionFee.weightedAverageCost ?? 0,
    2
  );
  const spreadFee = roundToDecimal(+data.income.details.spreadFee.weightedAverageCost ?? 0, 2);
  const withdrawalFee = roundToDecimal(
    +data.income.details.withdrawalFee.weightedAverageCost ?? 0,
    2
  );
  const depositFee = roundToDecimal(+data.income.details.depositFee.weightedAverageCost ?? 0, 2);
  const liquidationFee = roundToDecimal(
    +data.income.details.liquidationFee.weightedAverageCost ?? 0,
    2
  );
  const guaranteedStopLossFee = roundToDecimal(
    +data.income.details.guaranteedStopFee.weightedAverageCost ?? 0,
    2
  );
  const totalRevenue = roundToDecimal(
    +data.income.details.transactionFee.weightedAverageCost +
      +data.income.details.spreadFee.weightedAverageCost +
      +data.income.details.withdrawalFee.weightedAverageCost +
      +data.income.details.depositFee.weightedAverageCost +
      +data.income.details.liquidationFee.weightedAverageCost +
      +data.income.details.guaranteedStopFee.weightedAverageCost,
    2
  );

  // Info: (20230914 - Julian) ------------- Cost -------------
  const technicalSupplierCost = roundToDecimal(+data.costs.details.technicalProviderFee ?? 0, 2);
  const marketDataSupplierCost = roundToDecimal(+data.costs.details.marketDataProviderFee ?? 0, 2);
  const newCoinListingCost = roundToDecimal(+data.costs.details.newCoinListingCost ?? 0, 2);
  const totalCost = roundToDecimal(
    +data.costs.details.technicalProviderFee +
      +data.costs.details.marketDataProviderFee +
      +data.costs.details.newCoinListingCost,
    2
  );

  // Info: (20230914 - Julian) ------------- Operating expenses -------------
  const employeeSalaries = roundToDecimal(+data.operatingExpenses.details.salaries ?? 0, 2);
  const rent = roundToDecimal(+data.operatingExpenses.details.rent ?? 0, 2);
  const marketing = roundToDecimal(+data.operatingExpenses.details.marketing ?? 0, 2);
  const rebateExpenses = roundToDecimal(+data.operatingExpenses.details.commissionRebates ?? 0, 2);
  const totalOperatingExpenses = roundToDecimal(
    +data.operatingExpenses.details.salaries +
      +data.operatingExpenses.details.rent +
      +data.operatingExpenses.details.marketing +
      +data.operatingExpenses.details.commissionRebates,
    2
  );

  // Info: (20230914 - Julian) ------------- Financial costs -------------
  const interestExpense = roundToDecimal(+data.financialCosts.details.interestExpense ?? 0, 2);
  const cryptocurrencyForexLosses = roundToDecimal(
    +data.financialCosts.details.cryptocurrencyForexLosses ?? 0,
    2
  );
  const fiatToCryptocurrencyConversionLosses = roundToDecimal(
    +data.financialCosts.details.fiatToCryptocurrencyConversionLosses ?? 0,
    2
  );
  const cryptocurrencyToFiatConversionLosses = roundToDecimal(
    +data.financialCosts.details.cryptocurrencyToFiatConversionLosses ?? 0,
    2
  );
  const fiatToFiatConversionLosses = roundToDecimal(
    +data.financialCosts.details.fiatToFiatConversionLosses ?? 0,
    2
  );
  const totalFinancialCosts = roundToDecimal(
    +data.financialCosts.details.cryptocurrencyForexLosses +
      +data.financialCosts.details.cryptocurrencyForexLosses +
      +data.financialCosts.details.fiatToCryptocurrencyConversionLosses +
      +data.financialCosts.details.cryptocurrencyToFiatConversionLosses +
      +data.financialCosts.details.fiatToFiatConversionLosses,
    2
  );

  // Info: (20230914 - Julian) Total other gains/losses
  const investmentGains = roundToDecimal(data.otherGainsLosses.details.investmentGains ?? 0, 2);
  const forexGains = roundToDecimal(data.otherGainsLosses.details.forexGains ?? 0, 2);
  const cryptocurrencyGains = roundToDecimal(
    data.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost ?? 0,
    2
  );
  const totalOtherGains = roundToDecimal(
    +data.otherGainsLosses.details.investmentGains +
      +data.otherGainsLosses.details.forexGains +
      +data.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost,
    2
  );
  const netProfit = roundToDecimal(+data.netProfit ?? 0, 2);

  return {
    tradingFee,
    spreadFee,
    withdrawalFee,
    depositFee,
    liquidationFee,
    guaranteedStopLossFee,
    totalRevenue,
    technicalSupplierCost,
    marketDataSupplierCost,
    newCoinListingCost,
    totalCost,
    employeeSalaries,
    rent,
    marketing,
    rebateExpenses,
    totalOperatingExpenses,
    interestExpense,
    cryptocurrencyForexLosses,
    fiatToCryptocurrencyConversionLosses,
    cryptocurrencyToFiatConversionLosses,
    fiatToFiatConversionLosses,
    totalFinancialCosts,
    investmentGains,
    forexGains,
    cryptocurrencyGains,
    totalOtherGains,
    netProfit,
  };
};

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
  if (!dataA || !dataB)
    return {
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
  endData: IIncomeAccountingDetail | undefined,
  startData: IIncomeAccountingDetail | undefined
) => {
  const thead = [`${title}`, date[0], '*-*', '*-*', date[1], '*-*', '*-*'];

  if (!endData || !startData)
    return {
      thead,
      // Info: (20230915 - Julian) Default table
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

  // Info: (20230921 - Julian) USD
  const endUsd = endData.breakdown.USD;
  const startUsd = startData.breakdown.USD;

  // Info: (20230921 - Julian) Bitcoin
  const endBit = endData.breakdown.BTC;
  const startBit = startData.breakdown.BTC;

  // Info: (20230921 - Julian) Ethereum
  const endEth = endData.breakdown.ETH;
  const startEth = startData.breakdown.ETH;

  // Info: (20230921 - Julian) USDT
  const endUsdt = endData.breakdown.USDT;
  const startUsdt = startData.breakdown.USDT;

  // Info: (20230921 - Julian) Total
  const totalAmount = '—';
  const endTotalCost = +endData.weightedAverageCost;
  const startTotalCost = +startData.weightedAverageCost;

  // Info: (20230921 - Julian) Percentage
  const endUsdPercentage = (+endUsd.weightedAverageCost / endTotalCost) * 100;
  const startUsdPercentage = (+startUsd.weightedAverageCost / startTotalCost) * 100;

  const endBitPercentage = (+endBit.weightedAverageCost / endTotalCost) * 100;
  const startBitPercentage = (+startBit.weightedAverageCost / startTotalCost) * 100;

  const endEthPercentage = (+endEth.weightedAverageCost / endTotalCost) * 100;
  const startEthPercentage = (+startEth.weightedAverageCost / startTotalCost) * 100;

  const endUsdtPercentage = (+endUsdt.weightedAverageCost / endTotalCost) * 100;
  const startUsdtPercentage = (+startUsdt.weightedAverageCost / startTotalCost) * 100;

  const endTotalPercentage =
    endUsdPercentage + endBitPercentage + endEthPercentage + endUsdtPercentage;
  const startTotalPercentage =
    startUsdPercentage + startBitPercentage + startEthPercentage + startUsdtPercentage;

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
        `${roundToDecimal(+endUsd.amount, 2)}`,
        `$ ${roundToDecimal(+endUsd.weightedAverageCost, 2)}`,
        `${roundToDecimal(endUsdPercentage, 1)} %`,
        `${roundToDecimal(+startUsd.amount, 2)}`,
        `$ ${roundToDecimal(+startUsd.weightedAverageCost, 2)}`,
        `${roundToDecimal(startUsdPercentage, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `Bitcoin`,
        `${roundToDecimal(+endBit.amount, 2)}`,
        `${roundToDecimal(+endBit.weightedAverageCost, 2)}`,
        `${roundToDecimal(endBitPercentage, 1)} %`,
        `${roundToDecimal(+startBit.amount, 2)}`,
        `${roundToDecimal(+startBit.weightedAverageCost, 2)}`,
        `${roundToDecimal(startBitPercentage, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `Ethereum`,
        `${roundToDecimal(+endEth.amount, 2)}`,
        `${roundToDecimal(+endEth.weightedAverageCost, 2)}`,
        `${roundToDecimal(endEthPercentage, 1)} %`,
        `${roundToDecimal(+startEth.amount, 2)}`,
        `${roundToDecimal(+startEth.weightedAverageCost, 2)}`,
        `${roundToDecimal(startEthPercentage, 1)} %`,
      ],
    },
    {
      rowType: RowType.bookkeeping,
      rowData: [
        `USDT`,
        `${roundToDecimal(+endUsdt.amount, 2)}`,
        `${roundToDecimal(+endUsdt.weightedAverageCost, 2)}`,
        `${roundToDecimal(endUsdtPercentage, 1)} %`,
        `${roundToDecimal(+startUsdt.amount, 2)}`,
        `${roundToDecimal(+startUsdt.weightedAverageCost, 2)}`,
        `${roundToDecimal(startUsdtPercentage, 1)} %`,
      ],
    },
    {
      rowType: RowType.foot,
      rowData: [
        `Total ${title}`,
        `${totalAmount}`,
        `$ ${roundToDecimal(+endTotalCost, 2)}`,
        `${roundToDecimal(endTotalPercentage, 1)} %`,
        `${totalAmount}`,
        `$ ${roundToDecimal(+startTotalCost, 2)}`,
        `${roundToDecimal(startTotalPercentage, 1)} %`,
      ],
    },
  ];

  const result: ITable = {
    thead,
    tbody,
  };
  return result;
};

export const getRevenueChange = (thisYear: number, lastYear: number) => {
  const percentage = ((thisYear - lastYear) / lastYear) * 100;
  return roundToDecimal(percentage, 2);
};
