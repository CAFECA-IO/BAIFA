export interface ICashFlowsItem {
  totalAmountFairValue: number;
  items:
    | {
        BTC: {
          amount: number;
          fairValue: number;
          costValue: number;
        };
      }
    | {
        USD: {
          amount: number;
          fairValue: number;
        };
      };
}

export interface IStatementsOfCashFlows {
  id: string;
  date: string;
  operatingActivities: {
    cashDepositedByCustomers: ICashFlowsItem;
    cashWithdrawnByCustomers: ICashFlowsItem;
    purchaseOfCryptocurrencies: ICashFlowsItem;
    disposalOfCryptocurrencies: ICashFlowsItem;
    cashPaidToSuppliersForExpenses: ICashFlowsItem;
    cashReceivedFromCustomersAsTransactionFee: ICashFlowsItem;
    cashReceivedFromCustomersForLiquidationInCFDTrading: ICashFlowsItem;
    cashPaidToCustomersAsRebatesForTransactionFees: ICashFlowsItem;
    cashPaidToCustomersForCFDTradingProfits: ICashFlowsItem;
    insuranceFundForPerpetualContracts: ICashFlowsItem;
    cashPaidToCustomersForFundingRatesInPerpetualContract: ICashFlowsItem;
    cashPaidToCustomersForPerpetualContractProfits: ICashFlowsItem;
    cashReceivedFromCustomersForLiquidationInPerpetualContract: ICashFlowsItem;
  };
  investingActivities: {
    details: string;
  };
  financingActivities: {
    proceedsFromIssuanceOfCommonStock: ICashFlowsItem;
    longTermDebt: ICashFlowsItem;
    shortTermBorrowings: ICashFlowsItem;
    paymentsOfDividends: ICashFlowsItem;
    treasuryStock: ICashFlowsItem;
  };
  supplementalScheduleOfNonCashOperatingActivities: {
    cryptocurrenciesDepositedByCustomers: ICashFlowsItem;
    cryptocurrenciesWithdrawnByCustomers: ICashFlowsItem;
    cryptocurrencyInflows: ICashFlowsItem;
    cryptocurrencyOutflows: ICashFlowsItem;
    purchaseOfCryptocurrenciesWithNonCashConsideration: ICashFlowsItem;
    disposalOfCryptocurrenciesForNonCashConsideration: ICashFlowsItem;
    cryptocurrenciesReceivedFromCustomersAsTransactionFees: ICashFlowsItem;
    cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading: ICashFlowsItem;
    cryptocurrenciesPaidToCustomersAsRebatesForTransactionFees: ICashFlowsItem;
    cryptocurrenciesPaidToSuppliersForExpenses: ICashFlowsItem;
    cryptocurrenciesPaidToCustomersForCFDTradingProfits: ICashFlowsItem;
    insuranceFundForPerpetualContractsWithNonCashConsideration: ICashFlowsItem;
    cryptocurrenciesReceivedFromCustomersForLiquidationInPerpetualContract: ICashFlowsItem;
    cryptocurrenciesPaidToCustomersForPerpetualContractProfits: ICashFlowsItem;
    cryptocurrenciesPaidToCustomersForFundingRatesInPerpetualContract: ICashFlowsItem;
    cryptocurrenciesPaidToCustomersForProfitsInPerpetualContract: ICashFlowsItem;
  };
  otherSupplementaryItems: {
    relatedToCash: {
      effectOfExchangeRatesOnCash: ICashFlowsItem;
      cashCashEquivalentsAndRestrictedCashBeginningOfPeriod: ICashFlowsItem;
      cashCashEquivalentsAndRestrictedCashEndOfPeriod: ICashFlowsItem;
      netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: ICashFlowsItem;
    };
    relatedToNonCash: {
      valuationAdjustmentForCryptocurrencies: ICashFlowsItem;
      cryptocurrenciesBeginningOfPeriod: ICashFlowsItem;
      cryptocurrenciesEndOfPeriod: ICashFlowsItem;
      netIncreaseDecreaseInCryptocurrencies: ICashFlowsItem;
    };
  };
}
