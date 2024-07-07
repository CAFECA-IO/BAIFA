import {ICurrencyDetail} from '@/interfaces/report_currency_detail';

export interface ICashFlowAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    USD?: ICurrencyDetail;
    TWD?: ICurrencyDetail; // 確認去留
    HKD?: ICurrencyDetail; // 確認去留
  };
}

export interface INonCashAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    ETH?: ICurrencyDetail;
    BTC?: ICurrencyDetail;
    USDT?: ICurrencyDetail;
  };
}

export interface IConsiderationDetail {
  dateRange: {
    start: string;
    end: string;
  };
  type: string;
  weightedAverageCost: number;
  totalAmountFairValue: number;
  details: {
    from: ICurrencyDetail;
    to: ICurrencyDetail;
  }[];
}

export interface IStatementsOfCashFlow {
  id: string;
  startDate: string;
  endDate: string;
  operatingActivities: {
    weightedAverageCost: number;
    details: {
      cashDepositedByCustomers: ICashFlowAccountingDetail;
      cashWithdrawnByCustomers: ICashFlowAccountingDetail;
      purchaseOfCryptocurrencies: IConsiderationDetail;
      disposalOfCryptocurrencies: IConsiderationDetail;
      cashPaidToSuppliersForExpenses: ICashFlowAccountingDetail;
      cashReceivedFromCustomersAsTransactionFee: ICashFlowAccountingDetail;
      cashReceivedFromCustomersForLiquidationInCFDTrading: ICashFlowAccountingDetail;
      cashPaidToCustomersAsRebatesForTransactionFees: ICashFlowAccountingDetail;
      cashPaidToCustomersForCFDTradingProfits: ICashFlowAccountingDetail;
      insuranceFundForPerpetualContracts: ICashFlowAccountingDetail;
      cashPaidToCustomersForFundingRatesInPerpetualContract: ICashFlowAccountingDetail;
      cashPaidToCustomersForPerpetualContractProfits: ICashFlowAccountingDetail;
      cashReceivedFromCustomersForLiquidationInPerpetualContract: ICashFlowAccountingDetail;
    };
  };
  investingActivities: {
    weightedAverageCost: number;
    details: string;
  };
  financingActivities: {
    weightedAverageCost: number;
    details: {
      proceedsFromIssuanceOfCommonStock: ICashFlowAccountingDetail;
      longTermDebt: ICashFlowAccountingDetail;
      shortTermBorrowings: ICashFlowAccountingDetail;
      paymentsOfDividends: ICashFlowAccountingDetail;
      treasuryStock: ICashFlowAccountingDetail;
    };
  };
  supplementalScheduleOfNonCashOperatingActivities: {
    weightedAverageCost: number;
    details: {
      cryptocurrenciesDepositedByCustomers: INonCashAccountingDetail;
      cryptocurrenciesWithdrawnByCustomers: INonCashAccountingDetail;
      cryptocurrencyInflows: INonCashAccountingDetail;
      cryptocurrencyOutflows: INonCashAccountingDetail;
      purchaseOfCryptocurrenciesWithNonCashConsideration: IConsiderationDetail;
      disposalOfCryptocurrenciesForNonCashConsideration: IConsiderationDetail;
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
  };
  otherSupplementaryItems: {
    weightedAverageCost: number;
    details: {
      relatedToCash: {
        effectOfExchangeRatesOnCash: ICashFlowAccountingDetail;
        cashCashEquivalentsAndRestrictedCashBeginningOfPeriod: ICashFlowAccountingDetail;
        cashCashEquivalentsAndRestrictedCashEndOfPeriod: ICashFlowAccountingDetail;
        netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: ICashFlowAccountingDetail;
      };
      relatedToNonCash: {
        valuationAdjustmentForCryptocurrencies: INonCashAccountingDetail;
        cryptocurrenciesBeginningOfPeriod: INonCashAccountingDetail;
        cryptocurrenciesEndOfPeriod: INonCashAccountingDetail;
        netIncreaseDecreaseInCryptocurrencies: INonCashAccountingDetail;
      };
    };
  };
}
