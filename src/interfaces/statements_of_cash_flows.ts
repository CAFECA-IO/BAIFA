interface ICashFlowsAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    USD: {
      currencyType: 'FIAT';
      name: 'USD';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    TWD: {
      currencyType: 'FIAT';
      name: 'TWD';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    HKD: {
      currencyType: 'FIAT';
      name: 'HKD';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
  };
}

interface INonCashAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    ETH: {
      currencyType: 'CRYPTOCURRENCY';
      name: 'ETH';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    BTC: {
      currencyType: 'CRYPTOCURRENCY';
      name: 'BTC';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    USDT: {
      currencyType: 'CRYPTOCURRENCY';
      name: 'USDT';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
  };
}

interface IDisposalCryptoItem {
  dateRange: {
    start: string;
    end: string;
  };
  type: string;
  weightedAverageCost: number;
  totalAmountFairValue: number;
  details: [/* {
      from: {
        currencyType: 'FIAT';
        name: 'USD';
        amount: number;
        weightedAverageCost: number;
        fairValue: number;
      };
      to: {
        currencyType: 'CRYPTOCURRENCY';
        name: 'BTC';
        amount: number;
        weightedAverageCost: number;
        fairValue: number;
      };
    }*/];
}

export interface IStatementsOfCashFlows {
  id: string;
  date: string;
  operatingActivities: {
    cashDepositedByCustomers: ICashFlowsAccountingDetail;
    cashWithdrawnByCustomers: ICashFlowsAccountingDetail;
    purchaseOfCryptocurrencies: IDisposalCryptoItem;
    disposalOfCryptocurrencies: IDisposalCryptoItem;
    cashPaidToSuppliersForExpenses: ICashFlowsAccountingDetail;
    cashReceivedFromCustomersAsTransactionFee: ICashFlowsAccountingDetail;
    cashReceivedFromCustomersForLiquidationInCFDTrading: ICashFlowsAccountingDetail;
    cashPaidToCustomersAsRebatesForTransactionFees: ICashFlowsAccountingDetail;
    cashPaidToCustomersForCFDTradingProfits: ICashFlowsAccountingDetail;
    insuranceFundForPerpetualContracts: ICashFlowsAccountingDetail;
    cashPaidToCustomersForFundingRatesInPerpetualContract: ICashFlowsAccountingDetail;
    cashPaidToCustomersForPerpetualContractProfits: ICashFlowsAccountingDetail;
    cashReceivedFromCustomersForLiquidationInPerpetualContract: ICashFlowsAccountingDetail;
  };
  investingActivities: {
    details: string;
  };
  financingActivities: {
    proceedsFromIssuanceOfCommonStock: ICashFlowsAccountingDetail;
    longTermDebt: ICashFlowsAccountingDetail;
    shortTermBorrowings: ICashFlowsAccountingDetail;
    paymentsOfDividends: ICashFlowsAccountingDetail;
    treasuryStock: ICashFlowsAccountingDetail;
  };
  supplementalScheduleOfNonCashOperatingActivities: {
    cryptocurrenciesDepositedByCustomers: ICashFlowsAccountingDetail;
    cryptocurrenciesWithdrawnByCustomers: ICashFlowsAccountingDetail;
    cryptocurrencyInflows: ICashFlowsAccountingDetail;
    cryptocurrencyOutflows: ICashFlowsAccountingDetail;
    purchaseOfCryptocurrenciesWithNonCashConsideration: IDisposalCryptoItem;
    disposalOfCryptocurrenciesForNonCashConsideration: IDisposalCryptoItem;
    cryptocurrenciesReceivedFromCustomersAsTransactionFees: ICashFlowsAccountingDetail;
    cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading: ICashFlowsAccountingDetail;
    cryptocurrenciesPaidToCustomersAsRebatesForTransactionFees: ICashFlowsAccountingDetail;
    cryptocurrenciesPaidToSuppliersForExpenses: ICashFlowsAccountingDetail;
    cryptocurrenciesPaidToCustomersForCFDTradingProfits: ICashFlowsAccountingDetail;
    insuranceFundForPerpetualContractsWithNonCashConsideration: ICashFlowsAccountingDetail;
    cryptocurrenciesReceivedFromCustomersForLiquidationInPerpetualContract: ICashFlowsAccountingDetail;
    cryptocurrenciesPaidToCustomersForPerpetualContractProfits: ICashFlowsAccountingDetail;
    cryptocurrenciesPaidToCustomersForFundingRatesInPerpetualContract: ICashFlowsAccountingDetail;
    cryptocurrenciesPaidToCustomersForProfitsInPerpetualContract: ICashFlowsAccountingDetail;
  };
  otherSupplementaryItems: {
    relatedToCash: {
      effectOfExchangeRatesOnCash: ICashFlowsAccountingDetail;
      cashCashEquivalentsAndRestrictedCashBeginningOfPeriod: ICashFlowsAccountingDetail;
      cashCashEquivalentsAndRestrictedCashEndOfPeriod: ICashFlowsAccountingDetail;
      netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: ICashFlowsAccountingDetail;
    };
    relatedToNonCash: {
      valuationAdjustmentForCryptocurrencies: INonCashAccountingDetail;
      cryptocurrenciesBeginningOfPeriod: INonCashAccountingDetail;
      cryptocurrenciesEndOfPeriod: INonCashAccountingDetail;
      netIncreaseDecreaseInCryptocurrencies: INonCashAccountingDetail;
    };
  };
}
