import {IResult} from '../../interfaces/result';
import {APIURL} from '../../constants/api_request';
import {
  IStatementsOfCashFlow,
  INonCashAccountingDetail,
} from '../../interfaces/statements_of_cash_flow';
import {roundToDecimal} from '../common';

// Info: (20230919 - Julian) Get data from API
export const getStatementsOfCashFlow = async (date: string) => {
  let reportData;
  try {
    const response = await fetch(`${APIURL.STATEMENTS_OF_CASH_FLOW}?date=${date}`, {
      method: 'GET',
    });
    const result: IResult = await response.json();
    if (result.success) {
      reportData = result.data as IStatementsOfCashFlow;
    }
  } catch (error) {
    // console.log('Get statements of cash Flow error');
  }
  return reportData;
};

// Info: (20230919 - Julian) Simplify table data
export const getCashFlowTable = (data: IStatementsOfCashFlow | undefined) => {
  if (!data)
    return {
      cashDepositedByCustomers: 0,
      cashWithdrawnByCustomers: 0,
      purchaseOfCryptocurrencies: 0,
      disposalOfCryptocurrencies: 0,
      cashReceivedFromCustomersAsTransactionFee: 0,
      cashReceivedFromCustomersForLiquidationInCFDTrading: 0,
      cashPaidToCustomersAsRebatesForTransactionFees: 0,
      cashPaidToSuppliersForExpenses: 0,
      cashPaidToCustomersForCFDTradingProfits: 0,
      netCashProvidedByOperatingActivities: 0,
      netCashProvidedByInvestingActivities: 0,
      netCashProvidedByFinancingActivities: 0,
      netIncreaseDecreaseInCryptocurrencies: 0,
      cashCashEquivalentsAndRestrictedCashBeginningOfPeriod: 0,
      cashCashEquivalentsAndRestrictedCashEndOfPeriod: 0,
      cryptocurrenciesDepositedByCustomers: 0,
      cryptocurrenciesWithdrawnByCustomers: 0,
      cryptocurrencyInflows: 0,
      cryptocurrencyOutflows: 0,
      cryptocurrenciesReceivedFromCustomersAsTransactionFees: 0,
      cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading: 0,
      cryptocurrenciesPaidToCustomersForCFDTradingProfits: 0,
      purchaseOfCryptocurrenciesWithNonCashConsideration: 0,
      disposalOfCryptocurrenciesForNonCashConsideration: 0,
      netIncreaseInNonCashOperatingActivities: 0,
      cryptocurrenciesBeginningOfPeriod: 0,
      cryptocurrenciesEndOfPeriod: 0,
    };

  // Info: (20230918 - Julian) Cash Flow from operating activities
  const cashDepositedByCustomers =
    +data.operatingActivities.details.cashDepositedByCustomers.weightedAverageCost ?? 0;
  const cashWithdrawnByCustomers =
    +data.operatingActivities.details.cashWithdrawnByCustomers.weightedAverageCost ?? 0;
  const purchaseOfCryptocurrencies =
    +data.operatingActivities.details.purchaseOfCryptocurrencies.weightedAverageCost ?? 0;
  const disposalOfCryptocurrencies =
    +data.operatingActivities.details.disposalOfCryptocurrencies.weightedAverageCost ?? 0;
  const cashReceivedFromCustomersAsTransactionFee =
    +data.operatingActivities.details.cashReceivedFromCustomersAsTransactionFee
      .weightedAverageCost ?? 0;
  const cashReceivedFromCustomersForLiquidationInCFDTrading =
    +data.operatingActivities.details.cashReceivedFromCustomersForLiquidationInCFDTrading
      .weightedAverageCost ?? 0;
  const cashPaidToCustomersAsRebatesForTransactionFees =
    +data.operatingActivities.details.cashPaidToCustomersAsRebatesForTransactionFees
      .weightedAverageCost ?? 0;
  const cashPaidToSuppliersForExpenses =
    +data.operatingActivities.details.cashPaidToSuppliersForExpenses.weightedAverageCost ?? 0;
  const cashPaidToCustomersForCFDTradingProfits =
    +data.operatingActivities.details.cashPaidToCustomersForCFDTradingProfits.weightedAverageCost ??
    0;
  const netCashProvidedByOperatingActivities = +data.operatingActivities.weightedAverageCost ?? 0;
  // Info: (20230918 - Julian) Cash Flow from investing activities
  const netCashProvidedByInvestingActivities = +data.investingActivities.weightedAverageCost;
  // Info: (20230918 - Julian) Cash Flow from financing activities
  const netCashProvidedByFinancingActivities = +data.financingActivities.weightedAverageCost ?? 0;
  const netIncreaseDecreaseInCryptocurrencies =
    +data.otherSupplementaryItems.details.relatedToNonCash.netIncreaseDecreaseInCryptocurrencies
      .weightedAverageCost ?? 0;
  const cashCashEquivalentsAndRestrictedCashBeginningOfPeriod =
    +data.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesBeginningOfPeriod
      .weightedAverageCost ?? 0;
  const cashCashEquivalentsAndRestrictedCashEndOfPeriod =
    +data.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod
      .weightedAverageCost ?? 0;

  // Info: (20230918 - Julian) Supplemental schedule of non-cash operating activities
  const cryptocurrenciesDepositedByCustomers =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .cryptocurrenciesDepositedByCustomers.weightedAverageCost ?? 0;
  const cryptocurrenciesWithdrawnByCustomers =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .cryptocurrenciesWithdrawnByCustomers.weightedAverageCost ?? 0;
  const cryptocurrencyInflows =
    +data.supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows
      .weightedAverageCost ?? 0;
  const cryptocurrencyOutflows =
    +data.supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows
      .weightedAverageCost ?? 0;
  const cryptocurrenciesReceivedFromCustomersAsTransactionFees =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost ?? 0;
  const cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading.weightedAverageCost ?? 0;
  const cryptocurrenciesPaidToCustomersForCFDTradingProfits =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .cryptocurrenciesPaidToCustomersForCFDTradingProfits.weightedAverageCost ?? 0;
  const purchaseOfCryptocurrenciesWithNonCashConsideration =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost ?? 0;
  const disposalOfCryptocurrenciesForNonCashConsideration =
    +data.supplementalScheduleOfNonCashOperatingActivities.details
      .disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost ?? 0;
  const netIncreaseInNonCashOperatingActivities =
    +data.supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost ?? 0;
  const cryptocurrenciesBeginningOfPeriod =
    +data.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesBeginningOfPeriod
      .weightedAverageCost ?? 0;
  const cryptocurrenciesEndOfPeriod =
    +data.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod
      .weightedAverageCost ?? 0;

  return {
    cashDepositedByCustomers,
    cashWithdrawnByCustomers,
    purchaseOfCryptocurrencies,
    disposalOfCryptocurrencies,
    cashReceivedFromCustomersAsTransactionFee,
    cashReceivedFromCustomersForLiquidationInCFDTrading,
    cashPaidToCustomersAsRebatesForTransactionFees,
    cashPaidToSuppliersForExpenses,
    cashPaidToCustomersForCFDTradingProfits,
    netCashProvidedByOperatingActivities,
    netCashProvidedByInvestingActivities,
    netCashProvidedByFinancingActivities,
    netIncreaseDecreaseInCryptocurrencies,
    cashCashEquivalentsAndRestrictedCashBeginningOfPeriod,
    cashCashEquivalentsAndRestrictedCashEndOfPeriod,
    cryptocurrenciesDepositedByCustomers,
    cryptocurrenciesWithdrawnByCustomers,
    cryptocurrencyInflows,
    cryptocurrencyOutflows,
    cryptocurrenciesReceivedFromCustomersAsTransactionFees,
    cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading,
    cryptocurrenciesPaidToCustomersForCFDTradingProfits,
    purchaseOfCryptocurrenciesWithNonCashConsideration,
    disposalOfCryptocurrenciesForNonCashConsideration,
    netIncreaseInNonCashOperatingActivities,
    cryptocurrenciesBeginningOfPeriod,
    cryptocurrenciesEndOfPeriod,
  };
};

// Info: (20230919 - Julian) Simplify table data
export const getActivitiesAnalysis = (data: INonCashAccountingDetail | undefined) => {
  if (!data)
    return {
      totalAmount: '—',
      totalCost: 0,
      totalPercentage: 0,
      btcAmount: 0,
      btcCost: 0,
      btcPercentage: 0,
      ethAmount: 0,
      ethCost: 0,
      ethPercentage: 0,
      usdtAmount: 0,
      usdtCost: 0,
      usdtPercentage: 0,
    };

  const totalCost = +data.weightedAverageCost ?? 0;
  const btcAmount = +data.breakdown.BTC.amount ?? 0;
  const btcCost = +data.breakdown.BTC.weightedAverageCost ?? 0;
  const ethAmount = +data.breakdown.ETH.amount ?? 0;
  const ethCost = +data.breakdown.ETH.weightedAverageCost ?? 0;
  const usdtAmount = +data.breakdown.USDT.amount ?? 0;
  const usdtCost = +data.breakdown.USDT.weightedAverageCost ?? 0;

  const btcPercentage = (btcCost / (btcCost + ethCost + usdtCost)) * 100;
  const ethPercentage = (ethCost / (btcCost + ethCost + usdtCost)) * 100;
  const usdtPercentage = (usdtCost / (btcCost + ethCost + usdtCost)) * 100;
  const totalPercentage = btcPercentage + ethPercentage + usdtPercentage;

  return {
    totalAmount: '—',
    totalCost: roundToDecimal(totalCost, 2),
    totalPercentage: `${roundToDecimal(totalPercentage, 1)} %`,
    btcAmount: roundToDecimal(btcAmount, 2),
    btcCost: `$ ${roundToDecimal(btcCost, 2)}`,
    btcPercentage: `${roundToDecimal(btcPercentage, 1)} %`,
    ethAmount: roundToDecimal(ethAmount, 2),
    ethCost: roundToDecimal(ethCost, 2),
    ethPercentage: `${roundToDecimal(ethPercentage, 1)} %`,
    usdtAmount: roundToDecimal(usdtAmount, 2),
    usdtCost: roundToDecimal(usdtCost, 2),
    usdtPercentage: `${roundToDecimal(usdtPercentage, 1)} %`,
  };
};

export const getNonCashPurchaseData = (data: IStatementsOfCashFlow | undefined) => {
  if (!data)
    return {
      btcAmount: 0,
      btcCostValue: 0,
      btcPercentage: 0,
      ethAmount: 0,
      ethCostValue: 0,
      ethPercentage: 0,
      usdtAmount: 0,
      usdtCostValue: 0,
      usdtPercentage: 0,
      totalAmount: '—',
      totalCostValue: 0,
      totalPercentage: 0,
    };

  const purchaseData =
    data?.supplementalScheduleOfNonCashOperatingActivities.details
      .purchaseOfCryptocurrenciesWithNonCashConsideration;

  // Info: (20230920 - Julian) ------------ BTC ------------
  const btcPurchaseData =
    purchaseData?.details
      // Info: (20230920 - Julian) 找出買入(to) BTC 的資料
      .filter(item => item.to.name === 'BTC') ?? [];

  // Info: (20230920 - Julian) 將 amount 加總
  const btcAmount = btcPurchaseData.reduce((acc, cur) => acc + cur.to.amount, 0) ?? 0;
  // Info: (20230920 - Julian) 將所花費的(from) USDT 加總
  const btcCostValue =
    btcPurchaseData.reduce((acc, cur) => acc + cur.from.weightedAverageCost, 0) ?? 0;

  // Info: (20230920 - Julian) ------------ ETH ------------
  const ethPurchaseData =
    purchaseData?.details
      // Info: (20230920 - Julian) 找出買入(to) ETH 的資料
      .filter(item => item.to.name === 'ETH') ?? [];

  const ethAmount = ethPurchaseData.reduce((acc, cur) => acc + cur.to.amount, 0) ?? 0;
  const ethCostValue =
    // Info: (20230920 - Julian) 將所花費的(from) USDT 加總
    ethPurchaseData.reduce((acc, cur) => acc + cur.from.weightedAverageCost, 0) ?? 0;

  // Info: (20230920 - Julian) ------------ USDT ------------
  const usdtPurchaseData =
    purchaseData?.details
      // Info: (20230920 - Julian) 找出買入(to) USDT 的資料
      .filter(item => item.to.name === 'USDT') ?? [];
  const usdtAmount = usdtPurchaseData.reduce((acc, cur) => acc + cur.to.amount, 0) ?? 0;
  const usdtCostValue =
    usdtPurchaseData
      // Info: (20230920 - Julian) 將所花費的(from) USDT 加總
      .reduce((acc, cur) => acc + cur.from.weightedAverageCost, 0) ?? 0;

  // Info: (20230920 - Julian) ------------ Total ------------
  const totalCostValue = purchaseData?.weightedAverageCost ?? 0;

  const btcPercentage = (btcCostValue / totalCostValue) * 100;
  const ethPercentage = (ethCostValue / totalCostValue) * 100;
  const usdtPercentage = (usdtCostValue / totalCostValue) * 100;
  const totalPercentage = btcPercentage + ethPercentage + usdtPercentage;

  return {
    btcAmount: `${roundToDecimal(btcAmount, 2)}`,
    btcCostValue: `$ ${roundToDecimal(btcCostValue, 2)}`,
    btcPercentage: `${roundToDecimal(btcPercentage, 1)} %`,
    ethAmount: `${roundToDecimal(ethAmount, 2)}`,
    ethCostValue: `${roundToDecimal(ethCostValue, 2)}`,
    ethPercentage: `${roundToDecimal(ethPercentage, 1)} %`,
    usdtAmount: `${roundToDecimal(usdtAmount, 2)}`,
    usdtCostValue: `${roundToDecimal(usdtCostValue, 2)}`,
    usdtPercentage: `${roundToDecimal(usdtPercentage, 1)} %`,
    totalAmount: '—',
    totalCostValue: `$ ${roundToDecimal(totalCostValue, 2)}`,
    totalPercentage: `${roundToDecimal(totalPercentage, 1)} %`,
  };
};

export const getNonCashDisposalData = (data: IStatementsOfCashFlow | undefined) => {
  if (!data)
    return {
      btcAmount: 0,
      btcCostValue: 0,
      btcPercentage: 0,
      ethAmount: 0,
      ethCostValue: 0,
      ethPercentage: 0,
      usdtAmount: 0,
      usdtCostValue: 0,
      usdtPercentage: 0,
      totalAmount: '—',
      totalCostValue: 0,
      totalPercentage: 0,
    };

  const disposalData =
    data?.supplementalScheduleOfNonCashOperatingActivities.details
      .disposalOfCryptocurrenciesForNonCashConsideration;

  // Info: (20230920 - Julian) ------------ BTC ------------
  const btcDisposalData =
    disposalData?.details
      // Info: (20230920 - Julian) 找出賣出(from) BTC 的資料
      .filter(item => item.from.name === 'BTC') ?? [];

  // Info: (20230920 - Julian) 將 amount 加總
  const btcAmount = btcDisposalData.reduce((acc, cur) => acc + cur.from.amount, 0) ?? 0;
  // Info: (20230920 - Julian) 將得到的(to) USDT 加總
  const btcCostValue =
    btcDisposalData.reduce((acc, cur) => acc + cur.to.weightedAverageCost, 0) ?? 0;

  // Info: (20230920 - Julian) ------------ ETH ------------
  const ethDisposalData =
    disposalData?.details
      // Info: (20230920 - Julian) 找出賣出(from) ETH 的資料
      .filter(item => item.from.name === 'ETH') ?? [];

  const ethAmount = ethDisposalData.reduce((acc, cur) => acc + cur.from.amount, 0) ?? 0;
  const ethCostValue =
    // Info: (20230920 - Julian) 將得到的(to) USDT 加總
    ethDisposalData.reduce((acc, cur) => acc + cur.to.weightedAverageCost, 0) ?? 0;

  // Info: (20230920 - Julian) ------------ USDT ------------
  const usdtPurchaseData =
    disposalData?.details
      // Info: (20230920 - Julian) 找出賣出(from) USDT 的資料
      .filter(item => item.from.name === 'USDT') ?? [];
  const usdtAmount = usdtPurchaseData.reduce((acc, cur) => acc + cur.from.amount, 0) ?? 0;
  const usdtCostValue =
    usdtPurchaseData
      // Info: (20230920 - Julian) 將得到的(to) USDT 加總
      .reduce((acc, cur) => acc + cur.to.weightedAverageCost, 0) ?? 0;

  // Info: (20230920 - Julian) ------------ Total ------------
  const totalCostValue = disposalData?.weightedAverageCost ?? 0;

  const btcPercentage = (btcCostValue / totalCostValue) * 100;
  const ethPercentage = (ethCostValue / totalCostValue) * 100;
  const usdtPercentage = (usdtCostValue / totalCostValue) * 100;
  const totalPercentage = btcPercentage + ethPercentage + usdtPercentage;

  return {
    btcAmount: `${roundToDecimal(btcAmount, 2)}`,
    btcCostValue: `$ ${roundToDecimal(btcCostValue, 2)}`,
    btcPercentage: `${roundToDecimal(btcPercentage, 1)} %`,
    ethAmount: `${roundToDecimal(ethAmount, 2)}`,
    ethCostValue: `${roundToDecimal(ethCostValue, 2)}`,
    ethPercentage: `${roundToDecimal(ethPercentage, 1)} %`,
    usdtAmount: `${roundToDecimal(usdtAmount, 2)}`,
    usdtCostValue: `${roundToDecimal(usdtCostValue, 2)}`,
    usdtPercentage: `${roundToDecimal(usdtPercentage, 1)} %`,
    totalAmount: '—',
    totalCostValue: `$ ${roundToDecimal(totalCostValue, 2)}`,
    totalPercentage: `${roundToDecimal(totalPercentage, 1)} %`,
  };
};
