import {IResult} from '../../interfaces/result';
import {APIURL} from '../../constants/api_request';
import {
  IStatementsOfCashFlows,
  INonCashAccountingDetail,
} from '../../interfaces/statements_of_cash_flows';
import {roundToDecimal} from '../common';

// Info: (20230919 - Julian) Get data from API
export const getStatementsOfCashFlows = async (date: string) => {
  let reportData;
  try {
    const response = await fetch(`${APIURL.STATEMENTS_OF_CASH_FLOWS}?date=${date}`, {
      method: 'GET',
    });
    const result: IResult = await response.json();
    if (result.success) {
      reportData = result.data as IStatementsOfCashFlows;
    }
  } catch (error) {
    // console.log('Get statements of cash flows error');
  }
  return reportData;
};

// Info: (20230919 - Julian) Simplify table data
export const getCashFlowsTable = (data: IStatementsOfCashFlows | undefined) => {
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

  // Info: (20230918 - Julian) Cash flows from operating activities
  const cashDepositedByCustomers =
    +data?.operatingActivities.cashDepositedByCustomers.weightedAverageCost ?? 0;
  const cashWithdrawnByCustomers =
    +data?.operatingActivities.cashWithdrawnByCustomers.weightedAverageCost ?? 0;
  const purchaseOfCryptocurrencies =
    +data?.operatingActivities.purchaseOfCryptocurrencies.weightedAverageCost ?? 0;
  const disposalOfCryptocurrencies =
    +data?.operatingActivities.disposalOfCryptocurrencies.weightedAverageCost ?? 0;
  const cashReceivedFromCustomersAsTransactionFee =
    +data?.operatingActivities.cashReceivedFromCustomersAsTransactionFee.weightedAverageCost ?? 0;
  const cashReceivedFromCustomersForLiquidationInCFDTrading =
    +data?.operatingActivities.cashReceivedFromCustomersForLiquidationInCFDTrading
      .weightedAverageCost ?? 0;
  const cashPaidToCustomersAsRebatesForTransactionFees =
    +data?.operatingActivities.cashPaidToCustomersAsRebatesForTransactionFees.weightedAverageCost ??
    0;
  const cashPaidToSuppliersForExpenses =
    +data?.operatingActivities.cashPaidToSuppliersForExpenses.weightedAverageCost ?? 0;
  const cashPaidToCustomersForCFDTradingProfits =
    +data?.operatingActivities.cashPaidToCustomersForCFDTradingProfits.weightedAverageCost ?? 0;
  const netCashProvidedByOperatingActivities =
    cashDepositedByCustomers +
    cashWithdrawnByCustomers +
    purchaseOfCryptocurrencies +
    disposalOfCryptocurrencies +
    cashReceivedFromCustomersAsTransactionFee +
    cashReceivedFromCustomersForLiquidationInCFDTrading +
    cashPaidToCustomersAsRebatesForTransactionFees +
    cashPaidToSuppliersForExpenses +
    cashPaidToCustomersForCFDTradingProfits;
  // Info: (20230918 - Julian) Cash flows from investing activities
  const netCashProvidedByInvestingActivities = +data?.investingActivities.details ?? 0;
  // Info: (20230918 - Julian) Cash flows from financing activities
  const netCashProvidedByFinancingActivities =
    (+data.financingActivities.longTermDebt.weightedAverageCost ?? 0) +
    (+data.financingActivities.paymentsOfDividends.weightedAverageCost ?? 0) +
    (+data.financingActivities.proceedsFromIssuanceOfCommonStock.weightedAverageCost ?? 0) +
    (+data.financingActivities.shortTermBorrowings.weightedAverageCost ?? 0) +
    (+data.financingActivities.treasuryStock.weightedAverageCost ?? 0);
  const netIncreaseDecreaseInCryptocurrencies =
    +data?.otherSupplementaryItems.relatedToNonCash.netIncreaseDecreaseInCryptocurrencies
      .weightedAverageCost ?? 0;
  const cashCashEquivalentsAndRestrictedCashBeginningOfPeriod =
    +data.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesBeginningOfPeriod
      .weightedAverageCost ?? 0;
  const cashCashEquivalentsAndRestrictedCashEndOfPeriod =
    +data.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesEndOfPeriod
      .weightedAverageCost ?? 0;

  // Info: (20230918 - Julian) Supplemental schedule of non-cash operating activities
  const cryptocurrenciesDepositedByCustomers =
    +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrenciesDepositedByCustomers
      .weightedAverageCost ?? 0;
  const cryptocurrenciesWithdrawnByCustomers =
    +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrenciesWithdrawnByCustomers
      .weightedAverageCost ?? 0;
  const cryptocurrencyInflows =
    +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyInflows
      .weightedAverageCost ?? 0;
  const cryptocurrencyOutflows =
    +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyOutflows
      .weightedAverageCost ?? 0;
  const cryptocurrenciesReceivedFromCustomersAsTransactionFees =
    +data.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost ?? 0;
  const cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading =
    +data.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading.weightedAverageCost ?? 0;
  const cryptocurrenciesPaidToCustomersForCFDTradingProfits =
    +data.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesPaidToCustomersForCFDTradingProfits.weightedAverageCost ?? 0;
  const purchaseOfCryptocurrenciesWithNonCashConsideration =
    +data.supplementalScheduleOfNonCashOperatingActivities
      .purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost ?? 0;
  const disposalOfCryptocurrenciesForNonCashConsideration =
    +data.supplementalScheduleOfNonCashOperatingActivities
      .disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost ?? 0;
  const netIncreaseInNonCashOperatingActivities =
    cryptocurrenciesDepositedByCustomers +
    cryptocurrenciesWithdrawnByCustomers +
    cryptocurrencyInflows +
    cryptocurrencyOutflows +
    cryptocurrenciesReceivedFromCustomersAsTransactionFees +
    cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading +
    cryptocurrenciesPaidToCustomersForCFDTradingProfits +
    purchaseOfCryptocurrenciesWithNonCashConsideration +
    disposalOfCryptocurrenciesForNonCashConsideration;
  const cryptocurrenciesBeginningOfPeriod =
    +data?.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesBeginningOfPeriod
      .weightedAverageCost ?? 0;
  const cryptocurrenciesEndOfPeriod =
    +data?.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesEndOfPeriod
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

  const totalCost = +data?.weightedAverageCost ?? 0;
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
