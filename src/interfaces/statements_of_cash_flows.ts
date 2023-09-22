import {IStatementCurrencyDetail} from './currency_detail';

interface ICashFlowsAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    USD: IStatementCurrencyDetail;
    TWD: IStatementCurrencyDetail;
    HKD: IStatementCurrencyDetail;
  };
}

export interface INonCashAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    ETH: IStatementCurrencyDetail;
    BTC: IStatementCurrencyDetail;
    USDT: IStatementCurrencyDetail;
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
  details: {
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
  }[];
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
    cryptocurrenciesDepositedByCustomers: INonCashAccountingDetail;
    cryptocurrenciesWithdrawnByCustomers: INonCashAccountingDetail;
    cryptocurrencyInflows: INonCashAccountingDetail;
    cryptocurrencyOutflows: INonCashAccountingDetail;
    purchaseOfCryptocurrenciesWithNonCashConsideration: IDisposalCryptoItem;
    disposalOfCryptocurrenciesForNonCashConsideration: IDisposalCryptoItem;
    cryptocurrenciesReceivedFromCustomersAsTransactionFees: INonCashAccountingDetail;
    cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading: INonCashAccountingDetail;
    cryptocurrenciesPaidToCustomersAsRebatesForTransactionFees: INonCashAccountingDetail;
    cryptocurrenciesPaidToSuppliersForExpenses: INonCashAccountingDetail;
    cryptocurrenciesPaidToCustomersForCFDTradingProfits: INonCashAccountingDetail;
    insuranceFundForPerpetualContractsWithNonCashConsideration: INonCashAccountingDetail;
    cryptocurrenciesReceivedFromCustomersForLiquidationInPerpetualContract: INonCashAccountingDetail;
    cryptocurrenciesPaidToCustomersForPerpetualContractProfits: INonCashAccountingDetail;
    cryptocurrenciesPaidToCustomersForFundingRatesInPerpetualContract: INonCashAccountingDetail;
    cryptocurrenciesPaidToCustomersForProfitsInPerpetualContract: INonCashAccountingDetail;
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
