import {APIURL} from '../../constants/api_request';
import {IResult} from '../../interfaces/result';
import {
  IComprehensiveIncomeStatements,
  IIncomeAccountingDetail,
} from '../../interfaces/comprehensive_income_statements';
import {defaultStatementCurrencyDetail} from '../../interfaces/currency_detail';
import {roundToDecimal} from '../../lib/common';

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

export const getRevenue = (data: IIncomeAccountingDetail | undefined) => {
  if (!data)
    return {
      usdAmount: '—',
      usdCostValue: '—',
      usdPercentage: '—',
      bitAmount: '—',
      bitCostValue: '—',
      bitPercentage: '—',
      ethAmount: '—',
      ethCostValue: '—',
      ethPercentage: '—',
      usdtAmount: '—',
      usdtCostValue: '—',
      usdtPercentage: '—',
      totalAmount: '—',
      totalCostValue: '—',
      totalPercentage: '—',
    };

  const usdData = data.breakdown.USD ?? defaultStatementCurrencyDetail;
  const bitData = data.breakdown.BTC ?? defaultStatementCurrencyDetail;
  const ethData = data.breakdown.ETH ?? defaultStatementCurrencyDetail;
  const usdtData = data.breakdown.USDT ?? defaultStatementCurrencyDetail;
  const totalData = data.weightedAverageCost;

  const usdPer = (usdData.weightedAverageCost / totalData) * 100;
  const bitPer = (bitData.weightedAverageCost / totalData) * 100;
  const ethPer = (ethData.weightedAverageCost / totalData) * 100;
  const usdtPer = (usdtData.weightedAverageCost / totalData) * 100;
  const totalPer = usdPer + bitPer + ethPer + usdtPer;

  return {
    usdAmount: roundToDecimal(+usdData.amount ?? 0, 2),
    usdCostValue: roundToDecimal(usdData.weightedAverageCost ?? 0, 2),
    usdPercentage: roundToDecimal(usdPer, 1),
    bitAmount: roundToDecimal(+bitData.amount ?? 0, 2),
    bitCostValue: roundToDecimal(+bitData.weightedAverageCost ?? 0, 2),
    bitPercentage: roundToDecimal(bitPer, 1),
    ethAmount: roundToDecimal(+ethData.amount ?? 0, 2),
    ethCostValue: roundToDecimal(+ethData.weightedAverageCost ?? 0, 2),
    ethPercentage: roundToDecimal(ethPer, 1),
    usdtAmount: roundToDecimal(+usdtData.amount ?? 0, 2),
    usdtCostValue: roundToDecimal(+usdtData.weightedAverageCost ?? 0, 2),
    usdtPercentage: roundToDecimal(usdtPer, 1),
    totalAmount: '—',
    totalCostValue: roundToDecimal(totalData ?? 0, 2),
    totalPercentage: roundToDecimal(totalPer, 1),
  };
};

export const getRevenueChange = (thisYear: number, lastYear: number) => {
  const percentage = ((thisYear - lastYear) / lastYear) * 100;
  return roundToDecimal(percentage, 2);
};
