import {IStatementCurrencyDetail} from './currency_detail';

export interface IIncomeAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC: IStatementCurrencyDetail;
    ETH: IStatementCurrencyDetail;
    USDT: IStatementCurrencyDetail;
    USD: IStatementCurrencyDetail;
  };
}

export interface IComprehensiveIncomeStatements {
  id: string;
  startDate: string;
  endDate: string;
  income: {
    weightedAverageCost: number;
    details: {
      transactionFee: IIncomeAccountingDetail;
      spreadFee: IIncomeAccountingDetail;
      guaranteedStopFee: IIncomeAccountingDetail;
      liquidationFee: IIncomeAccountingDetail;
      withdrawalFee: IIncomeAccountingDetail;
      depositFee: IIncomeAccountingDetail;
    };
  };
  costs: {
    weightedAverageCost: number;
    details: {
      technicalProviderFee: number;
      marketDataProviderFee: number;
      newCoinListingCost: number;
    };
  };
  operatingExpenses: {
    weightedAverageCost: number;
    details: {
      salaries: number;
      rent: number;
      marketing: number;
      commissionRebates: IIncomeAccountingDetail;
    };
  };
  financialCosts: {
    weightedAverageCost: number;
    details: {
      interestExpense: number;
      cryptocurrencyForexLosses: number;
      fiatToCryptocurrencyConversionLosses: number;
      cryptocurrencyToFiatConversionLosses: number;
      fiatToFiatConversionLosses: number;
    };
  };
  otherGainsLosses: {
    weightedAverageCost: number;
    details: {
      investmentGains: number;
      forexGains: number;
      cryptocurrencyGains: IIncomeAccountingDetail;
    };
  };
  netProfit: number;
}
